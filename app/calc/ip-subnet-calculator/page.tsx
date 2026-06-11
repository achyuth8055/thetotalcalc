"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

// ─── IPv4 helpers ───────────────────────────────────────────────────────────

const OCTET = /^\d{1,3}$/;

// Parse a dotted-quad string into an unsigned 32-bit integer, or null if invalid.
function parseIp(ip: string): number | null {
  const parts = ip.trim().split(".");
  if (parts.length !== 4) return null;
  let value = 0;
  for (const part of parts) {
    if (!OCTET.test(part)) return null;
    const n = Number(part);
    if (n < 0 || n > 255) return null;
    value = (value * 256 + n) >>> 0;
  }
  return value >>> 0;
}

// Convert an unsigned 32-bit integer back to dotted-quad notation.
function intToIp(value: number): string {
  return [24, 16, 8, 0].map((shift) => (value >>> shift) & 0xff).join(".");
}

// Convert an unsigned 32-bit integer to a padded 32-bit binary string with dots.
function intToBinary(value: number): string {
  return [24, 16, 8, 0]
    .map((shift) => ((value >>> shift) & 0xff).toString(2).padStart(8, "0"))
    .join(".");
}

interface IpClassInfo {
  label: string;
  scope: "Private" | "Public" | "Loopback" | "Link-local" | "Reserved";
  note: string;
}

// Classify an address by its first octet and well-known reserved ranges.
function classifyIp(value: number): IpClassInfo {
  const o1 = (value >>> 24) & 0xff;
  const o2 = (value >>> 16) & 0xff;

  if (o1 === 127) return { label: "Class A", scope: "Loopback", note: "127.0.0.0/8 is reserved for loopback (your own machine)." };
  if (o1 === 169 && o2 === 254) return { label: "Class B", scope: "Link-local", note: "169.254.0.0/16 is auto-assigned when DHCP fails (APIPA)." };
  if (o1 === 10) return { label: "Class A", scope: "Private", note: "10.0.0.0/8 is a private range (RFC 1918) - not routable on the public internet." };
  if (o1 === 172 && o2 >= 16 && o2 <= 31) return { label: "Class B", scope: "Private", note: "172.16.0.0/12 is a private range (RFC 1918)." };
  if (o1 === 192 && o2 === 168) return { label: "Class C", scope: "Private", note: "192.168.0.0/16 is a private range (RFC 1918), common on home networks." };

  if (o1 >= 1 && o1 <= 126) return { label: "Class A", scope: "Public", note: "First octet 1-126 is historically Class A." };
  if (o1 >= 128 && o1 <= 191) return { label: "Class B", scope: "Public", note: "First octet 128-191 is historically Class B." };
  if (o1 >= 192 && o1 <= 223) return { label: "Class C", scope: "Public", note: "First octet 192-223 is historically Class C." };
  if (o1 >= 224 && o1 <= 239) return { label: "Class D", scope: "Reserved", note: "224.0.0.0/4 is reserved for multicast." };
  return { label: "Class E", scope: "Reserved", note: "240.0.0.0/4 is reserved for experimental use." };
}

interface SubnetResult {
  network: number;
  broadcast: number;
  mask: number;
  wildcard: number;
  firstHost: number;
  lastHost: number;
  totalAddresses: number;
  usableHosts: number;
  cls: IpClassInfo;
}

// Derive every subnet figure from an address and a CIDR prefix length.
function computeSubnet(ipValue: number, prefix: number): SubnetResult {
  const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
  const wildcard = (~mask) >>> 0;
  const network = (ipValue & mask) >>> 0;
  const broadcast = (network | wildcard) >>> 0;
  const totalAddresses = 2 ** (32 - prefix);

  // /31 is point-to-point (RFC 3021, 2 usable); /32 is a single host.
  let firstHost: number;
  let lastHost: number;
  let usableHosts: number;
  if (prefix >= 31) {
    firstHost = network;
    lastHost = broadcast;
    usableHosts = prefix === 31 ? 2 : 1;
  } else {
    firstHost = (network + 1) >>> 0;
    lastHost = (broadcast - 1) >>> 0;
    usableHosts = totalAddresses - 2;
  }

  return {
    network,
    broadcast,
    mask,
    wildcard,
    firstHost,
    lastHost,
    totalAddresses,
    usableHosts,
    cls: classifyIp(ipValue),
  };
}

const fmtInt = (v: number) => new Intl.NumberFormat("en-US").format(v);

// ─── Page ──────────────────────────────────────────────────────────────────

export default function IpSubnetCalculatorPage() {
  const [ip, setIp] = useState("192.168.1.10");
  const [prefix, setPrefix] = useState(24);

  const ipValue = useMemo(() => parseIp(ip), [ip]);
  const result = useMemo(
    () => (ipValue === null ? null : computeSubnet(ipValue, prefix)),
    [ipValue, prefix]
  );

  const inputCls =
    "w-full rounded-lg border border-surface-border bg-white p-3 font-mono text-body-md text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary";

  const scopeBadge: Record<IpClassInfo["scope"], string> = {
    Private: "bg-green-100 text-green-800 border border-green-200",
    Public: "bg-blue-100 text-blue-800 border border-blue-200",
    Loopback: "bg-surface-container text-on-surface-variant border border-surface-border",
    "Link-local": "bg-yellow-100 text-yellow-800 border border-yellow-200",
    Reserved: "bg-surface-container text-on-surface-variant border border-surface-border",
  };

  const rows: { label: string; value: string; mono?: boolean }[] = result
    ? [
        { label: "Network address", value: intToIp(result.network), mono: true },
        { label: "Broadcast address", value: intToIp(result.broadcast), mono: true },
        { label: "Subnet mask", value: intToIp(result.mask), mono: true },
        { label: "Wildcard mask", value: intToIp(result.wildcard), mono: true },
        { label: "First usable host", value: intToIp(result.firstHost), mono: true },
        { label: "Last usable host", value: intToIp(result.lastHost), mono: true },
        { label: "Usable hosts", value: fmtInt(result.usableHosts) },
        { label: "Total addresses", value: fmtInt(result.totalAddresses) },
      ]
    : [];

  return (
    <>
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <header className="border-b border-surface-border bg-surface-container-low pb-stack-lg pt-stack-lg">
        <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
          <nav className="mb-stack-md" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-stack-sm text-label-sm text-on-surface-variant">
              <li>
                <Link href="/" className="transition-colors hover:text-primary">Home</Link>
              </li>
              <li aria-hidden="true" className="material-symbols-outlined text-sm leading-none">chevron_right</li>
              <li>
                <Link href="/calculators" className="transition-colors hover:text-primary">Calculators</Link>
              </li>
              <li aria-hidden="true" className="material-symbols-outlined text-sm leading-none">chevron_right</li>
              <li className="font-bold text-primary">IP Subnet Calculator</li>
            </ol>
          </nav>
          <h1 className="mb-unit text-headline-lg text-primary">IP Subnet Calculator (IPv4 / CIDR)</h1>
          <p className="max-w-3xl text-body-md text-on-surface-variant">
            Enter an IPv4 address and a CIDR prefix to get the network and broadcast addresses, the subnet and wildcard masks, the usable host range, and how many hosts the block holds.
          </p>
        </div>
      </header>

      {/* ── Main ─────────────────────────────────────────────────────────── */}
      <main className="mx-auto max-w-3xl px-margin-mobile py-stack-lg md:px-margin-desktop">

        {/* ── Calculator card ──────────────────────────────────────────── */}
        <div className="premium-card relative overflow-hidden rounded-xl bg-white p-stack-lg">
          <div className="summary-accent absolute left-0 right-0 top-0" />

          <h2 className="mb-stack-lg text-headline-md text-primary">Address &amp; Prefix</h2>

          <div className="flex flex-col gap-stack-md">
            {/* IP address */}
            <div className="flex flex-col gap-unit">
              <label htmlFor="ip-input" className="text-label-md text-primary">IPv4 address</label>
              <input
                id="ip-input"
                type="text"
                inputMode="numeric"
                value={ip}
                onChange={(e) => setIp(e.target.value)}
                placeholder="192.168.1.10"
                className={inputCls}
                aria-invalid={ipValue === null}
              />
              {ipValue === null && (
                <p className="text-label-sm text-red-600">
                  Enter a valid IPv4 address - four numbers from 0 to 255 separated by dots.
                </p>
              )}
            </div>

            {/* Prefix */}
            <div className="flex flex-col gap-unit">
              <div className="flex items-center justify-between gap-3">
                <label htmlFor="prefix-input" className="text-label-md text-primary">CIDR prefix</label>
                <span className="font-mono text-label-md font-semibold text-primary">/{prefix}</span>
              </div>
              <input
                id="prefix-input"
                type="range"
                min={0}
                max={32}
                value={prefix}
                onChange={(e) => setPrefix(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-label-sm text-on-surface-variant">
                <span>/0</span>
                <span>/32</span>
              </div>
            </div>
          </div>

          {/* ── Results ──────────────────────────────────────────────── */}
          {result && (
            <div className="mt-stack-lg border-t border-surface-border pt-stack-lg">
              {/* Class / scope summary */}
              <div className="mb-stack-md flex flex-wrap items-center justify-between gap-stack-sm rounded-xl border border-surface-border bg-surface-container-low p-stack-md">
                <div>
                  <p className="text-label-sm text-on-surface-variant">{result.cls.label}</p>
                  <p className="font-mono text-headline-md text-primary">
                    {intToIp(ipValue as number)}/{prefix}
                  </p>
                </div>
                <span className={`rounded-full px-3 py-0.5 text-label-sm font-semibold ${scopeBadge[result.cls.scope]}`}>
                  {result.cls.scope}
                </span>
              </div>

              {/* Figures grid */}
              <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-surface-border bg-surface-border sm:grid-cols-2">
                {rows.map((row) => (
                  <div key={row.label} className="flex flex-col gap-0.5 bg-white p-stack-md">
                    <dt className="text-label-sm text-on-surface-variant">{row.label}</dt>
                    <dd className={`text-body-md font-semibold text-primary ${row.mono ? "font-mono" : ""}`}>
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>

              {/* Binary view */}
              <div className="mt-stack-md rounded-lg bg-surface-container-low p-stack-md">
                <p className="mb-stack-sm text-label-md text-primary">Binary breakdown</p>
                <div className="flex flex-col gap-unit font-mono text-label-sm text-on-surface-variant">
                  <div className="flex flex-wrap justify-between gap-2">
                    <span>Address</span><span className="text-on-surface">{intToBinary(ipValue as number)}</span>
                  </div>
                  <div className="flex flex-wrap justify-between gap-2">
                    <span>Mask</span><span className="text-on-surface">{intToBinary(result.mask)}</span>
                  </div>
                  <div className="flex flex-wrap justify-between gap-2">
                    <span>Network</span><span className="text-on-surface">{intToBinary(result.network)}</span>
                  </div>
                </div>
              </div>

              {/* Class note */}
              <p className="mt-stack-md text-label-sm text-on-surface-variant">{result.cls.note}</p>
            </div>
          )}
        </div>

        {/* ── How CIDR works ───────────────────────────────────────────── */}
        <section className="mt-stack-lg">
          <h2 className="mb-stack-md text-headline-md text-primary">How subnetting works</h2>
          <div className="premium-card rounded-xl bg-white p-stack-lg">
            <p className="text-body-md text-on-surface-variant">
              An IPv4 address is 32 bits, written as four 8-bit numbers (octets). A CIDR
              prefix like <span className="font-mono text-primary">/24</span> says how many of
              those leading bits identify the network - the rest identify hosts inside it. A
              <span className="font-mono text-primary"> /24</span> fixes the first 24 bits, leaving
              8 host bits, so the block holds 256 addresses (2 to the power of 8).
            </p>
            <p className="mt-stack-md text-body-md text-on-surface-variant">
              Two of those addresses are not assignable to devices: the first is the network
              address (all host bits 0) and the last is the broadcast address (all host bits 1).
              That is why a /24 has 256 total addresses but only 254 usable hosts. The subnet mask
              is just the prefix written as dotted-quad - a /24 mask is 255.255.255.0 - and the
              wildcard mask is its inverse, used by routers and access lists.
            </p>
          </div>
        </section>

        {/* ── Worked example ───────────────────────────────────────────── */}
        <section className="mt-stack-lg">
          <h2 className="mb-stack-md text-headline-md text-primary">Worked example: 192.168.1.10/26</h2>
          <div className="premium-card rounded-xl bg-white p-stack-lg">
            <p className="text-body-md text-on-surface-variant">
              A /26 fixes 26 bits and leaves 6 host bits, so each block holds 64 addresses. The
              mask is 255.255.255.192. Because 192.168.1.10 falls in the first block, the network
              address is 192.168.1.0 and the broadcast address is 192.168.1.63. Usable hosts run
              from 192.168.1.1 to 192.168.1.62 - that is 62 devices. The next block would start at
              192.168.1.64. Set the prefix above to /26 to see this calculated live.
            </p>
          </div>
        </section>

        {/* ── Common prefixes table ────────────────────────────────────── */}
        <section className="mt-stack-lg">
          <h2 className="mb-stack-md text-headline-md text-primary">Common prefixes at a glance</h2>
          <div className="premium-card overflow-x-auto rounded-xl bg-white p-stack-lg">
            <table className="w-full border-collapse text-body-md">
              <thead>
                <tr className="border-b border-surface-border text-left text-label-sm text-on-surface-variant">
                  <th className="py-stack-sm pr-stack-md font-semibold">Prefix</th>
                  <th className="py-stack-sm pr-stack-md font-semibold">Subnet mask</th>
                  <th className="py-stack-sm pr-stack-md font-semibold">Total</th>
                  <th className="py-stack-sm font-semibold">Usable hosts</th>
                </tr>
              </thead>
              <tbody className="font-mono text-on-surface-variant">
                {[
                  ["/30", "255.255.255.252", "4", "2"],
                  ["/29", "255.255.255.248", "8", "6"],
                  ["/28", "255.255.255.240", "16", "14"],
                  ["/27", "255.255.255.224", "32", "30"],
                  ["/26", "255.255.255.192", "64", "62"],
                  ["/24", "255.255.255.0", "256", "254"],
                  ["/16", "255.255.0.0", "65,536", "65,534"],
                ].map((r) => (
                  <tr key={r[0]} className="border-b border-surface-border last:border-0">
                    <td className="py-stack-sm pr-stack-md text-primary">{r[0]}</td>
                    <td className="py-stack-sm pr-stack-md">{r[1]}</td>
                    <td className="py-stack-sm pr-stack-md">{r[2]}</td>
                    <td className="py-stack-sm">{r[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── FAQs ─────────────────────────────────────────────────────── */}
        <section className="mt-stack-lg flex flex-col gap-stack-md">
          <h2 className="text-headline-md text-primary">Frequently asked questions</h2>
          <div className="flex flex-col gap-stack-sm">
            {FAQS.map((faq) => (
              <details key={faq.q} className="premium-card group cursor-pointer rounded-lg p-stack-md">
                <summary className="flex list-none items-center justify-between text-label-md text-primary">
                  <span>{faq.q}</span>
                  <span className="material-symbols-outlined flex-shrink-0 transition-transform group-open:rotate-180">
                    expand_more
                  </span>
                </summary>
                <p className="mt-stack-sm text-body-md text-on-surface-variant">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ── Disclaimer ───────────────────────────────────────────────── */}
        <p className="mt-stack-lg rounded-lg border border-surface-border bg-surface-container-low px-stack-md py-stack-sm text-label-sm text-on-surface-variant">
          <strong className="text-primary">Note:</strong> This tool covers IPv4 only and assumes
          classless (CIDR) addressing. Host counts use the standard rule of subtracting the network
          and broadcast addresses, with the RFC 3021 exception that a /31 provides two usable hosts
          for point-to-point links. Always confirm your design against your own network plan.
        </p>
      </main>
    </>
  );
}

// ─── FAQ data ────────────────────────────────────────────────────────────────

const FAQS: { q: string; a: string }[] = [
  {
    q: "What is the difference between the network and broadcast address?",
    a: "The network address has every host bit set to 0 and names the subnet itself - it is not given to a device. The broadcast address has every host bit set to 1 and is used to reach all hosts on the subnet at once. Both sit at the edges of the block, which is why they are excluded from the usable host count.",
  },
  {
    q: "Why does a /24 have 254 usable hosts instead of 256?",
    a: "A /24 leaves 8 host bits, which gives 2 to the power of 8 = 256 total addresses. The first (network) and last (broadcast) addresses are reserved, leaving 256 - 2 = 254 addresses you can assign to devices.",
  },
  {
    q: "What is a wildcard mask used for?",
    a: "A wildcard mask is the bitwise inverse of the subnet mask. A /24 mask of 255.255.255.0 has the wildcard 0.0.0.255. Routers and firewalls (for example in OSPF and Cisco access lists) use wildcard masks to match ranges of addresses, where a 1 bit means 'this bit can be anything'.",
  },
  {
    q: "How do private IP ranges relate to subnetting?",
    a: "RFC 1918 sets aside 10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16 for private networks. You can subnet freely inside these ranges because they are never routed on the public internet, which is why home and office networks almost always use them.",
  },
  {
    q: "What does /31 mean and why does it show two usable hosts?",
    a: "Normally the network and broadcast addresses are reserved, so a /31 (two total addresses) would have zero usable hosts. RFC 3021 makes an exception for point-to-point links, where both addresses can be assigned to the two endpoints, giving two usable hosts.",
  },
];
