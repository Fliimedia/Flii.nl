<?php
/**
 * Verwerkt het contactformulier van flii.nl.
 *
 * Beveiliging in lagen:
 *  1. honeypot   — verborgen veld dat alleen bots invullen
 *  2. tijdslot   — inzending binnen 3 seconden na laden wordt geweigerd
 *  3. snelheid   — maximaal 3 inzendingen per IP per uur
 *  4. validatie  — server-side, plus stripping van header-injectie
 *
 * Bij succes of fout keert de bezoeker terug naar /contact met een status.
 */

declare(strict_types=1);

const ONTVANGER   = 'info@flii.nl';
const AFZENDER    = 'info@flii.nl';          // moet op het eigen domein staan (SPF)
const TERUG       = '/contact';
const MIN_SECONDEN = 3;
const MAX_PER_UUR  = 3;

function terug(string $status): void
{
    header('Location: ' . TERUG . '?status=' . urlencode($status) . '#formulier', true, 303);
    exit;
}

/** Nieuwe regels uit koptekstvelden halen, anders is header-injectie mogelijk. */
function schoon(string $waarde): string
{
    return trim(str_replace(["\r", "\n", "%0a", "%0d"], ' ', $waarde));
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    terug('fout');
}

// ── 1. honeypot ────────────────────────────────────────────────────
// Het veld heet 'website' en is in de opmaak verborgen. Een mens laat
// het leeg. Wordt het gevuld, dan doen we alsof het gelukt is: een bot
// die een foutmelding krijgt, probeert het opnieuw.
if (!empty($_POST['website'])) {
    terug('ok');
}

// ── 2. tijdslot ────────────────────────────────────────────────────
$geladen = isset($_POST['geladen']) ? (int) $_POST['geladen'] : 0;
if ($geladen <= 0 || (time() - $geladen) < MIN_SECONDEN) {
    terug('ok');
}
// ouder dan twaalf uur: waarschijnlijk een hergebruikt formulier
if ((time() - $geladen) > 43200) {
    terug('verlopen');
}

// ── 3. snelheidsbegrenzing per IP ──────────────────────────────────
$ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
$pad = sys_get_temp_dir() . '/flii-contact-' . sha1($ip) . '.txt';
$nu = time();
$stempels = [];
if (is_readable($pad)) {
    $ruw = file_get_contents($pad);
    if ($ruw !== false) {
        $stempels = array_filter(
            array_map('intval', explode(',', $ruw)),
            static fn(int $t): bool => $t > $nu - 3600
        );
    }
}
if (count($stempels) >= MAX_PER_UUR) {
    terug('teveel');
}
$stempels[] = $nu;
@file_put_contents($pad, implode(',', $stempels), LOCK_EX);

// ── 4. validatie ───────────────────────────────────────────────────
$naam      = schoon($_POST['naam'] ?? '');
$email     = schoon($_POST['email'] ?? '');
$bedrijf   = schoon($_POST['bedrijf'] ?? '');
$onderwerp = schoon($_POST['onderwerp'] ?? 'Contactformulier');
$bericht   = trim($_POST['bericht'] ?? '');

if ($naam === '' || $bericht === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    terug('onvolledig');
}
if (mb_strlen($naam) > 120 || mb_strlen($bericht) > 5000) {
    terug('onvolledig');
}

$toegestaan = [
    'Nieuwe samenwerking',
    'Campagne of mediaplan',
    'Website of platform',
    'AI en automatisering',
    'Iets anders',
];
if (!in_array($onderwerp, $toegestaan, true)) {
    $onderwerp = 'Iets anders';
}

// ── 5. versturen ───────────────────────────────────────────────────
$regels = [
    'Naam:    ' . $naam,
    'E-mail:  ' . $email,
];
if ($bedrijf !== '') {
    $regels[] = 'Bedrijf: ' . $bedrijf;
}
$regels[] = 'Onderwerp: ' . $onderwerp;
$regels[] = '';
$regels[] = $bericht;
$regels[] = '';
$regels[] = str_repeat('-', 46);
$regels[] = 'Verstuurd via het contactformulier op flii.nl';
$regels[] = date('d-m-Y H:i');

$koppen = implode("\r\n", [
    'From: Flii Media <' . AFZENDER . '>',
    'Reply-To: ' . $naam . ' <' . $email . '>',
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: PHP/' . phpversion(),
]);

$gelukt = @mail(
    ONTVANGER,
    '[flii.nl] ' . $onderwerp . ' — ' . $naam,
    implode("\n", $regels),
    $koppen,
    '-f' . AFZENDER
);

terug($gelukt ? 'ok' : 'mislukt');
