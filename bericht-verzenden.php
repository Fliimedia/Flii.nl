<?php
/**
 * Verwerkt het korte berichtformulier in de contactblokken op de
 * landings- en kennisbankpagina's.
 *
 * Dezelfde beveiliging als het grote contactformulier:
 *  1. honeypot   — verborgen veld dat alleen bots invullen
 *  2. tijdslot   — inzending binnen 3 seconden na laden wordt geweigerd
 *  3. snelheid   — maximaal 3 inzendingen per IP per uur
 *  4. validatie  — server-side, plus stripping van header-injectie
 *
 * De bezoeker keert terug naar de pagina waar hij vandaan kwam.
 */

declare(strict_types=1);

const ONTVANGER = 'info@flii.nl';
const AFZENDER  = 'info@flii.nl';          // moet op het eigen domein staan (SPF)
const MIN_SECONDEN = 3;
const MAX_PER_UUR  = 3;

/** Alleen een pad op het eigen domein, zodat dit geen open doorstuurpunt wordt. */
function herkomst(): string
{
    $ruw = (string) ($_POST['herkomst'] ?? '/contact');
    if ($ruw === '' || $ruw[0] !== '/' || str_starts_with($ruw, '//')) {
        return '/contact';
    }
    $pad = parse_url($ruw, PHP_URL_PATH);
    return is_string($pad) && $pad !== '' ? $pad : '/contact';
}

function terug(string $status): void
{
    header('Location: ' . herkomst() . '?status=' . urlencode($status) . '#bericht', true, 303);
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
if (!empty($_POST['website'])) {
    terug('ok');
}

// ── 2. tijdslot ────────────────────────────────────────────────────
$geladen = isset($_POST['geladen']) ? (int) $_POST['geladen'] : 0;
if ($geladen <= 0 || (time() - $geladen) < MIN_SECONDEN) {
    terug('ok');
}
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
$contact = schoon($_POST['contact'] ?? '');
$bericht = trim($_POST['bericht'] ?? '');

if ($contact === '' || $bericht === '') {
    terug('onvolledig');
}
if (mb_strlen($contact) > 160 || mb_strlen($bericht) > 5000) {
    terug('onvolledig');
}

$isEmail = (bool) filter_var($contact, FILTER_VALIDATE_EMAIL);
// Een telefoonnummer: minstens acht cijfers, verder alleen scheidingstekens.
$cijfers = preg_replace('/\D/', '', $contact) ?? '';
$isTelefoon = preg_match('/^[\d\s+()\/.-]+$/', $contact) === 1 && strlen($cijfers) >= 8;
if (!$isEmail && !$isTelefoon) {
    terug('onvolledig');
}

// ── 5. versturen ───────────────────────────────────────────────────
$regels = [
    'Contact: ' . $contact,
    'Pagina:  ' . herkomst(),
    '',
    $bericht,
    '',
    str_repeat('-', 46),
    'Verstuurd via het contactblok op flii.nl',
    date('d-m-Y H:i'),
];

$kopregels = [
    'From: Flii Media <' . AFZENDER . '>',
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: PHP/' . phpversion(),
];
if ($isEmail) {
    $kopregels[] = 'Reply-To: ' . $contact;
}

$gelukt = @mail(
    ONTVANGER,
    '[flii.nl] Bericht via ' . herkomst(),
    implode("\n", $regels),
    implode("\r\n", $kopregels),
    '-f' . AFZENDER
);

terug($gelukt ? 'ok' : 'mislukt');
