# PIPEDA Findings

[Open PIPEDA Findings](https://coolcode.ca/pipeda-findings/)

<!-- coolcode:guide -->
Search for Bell and open report 2026-003. Its access-response deadline, cellphone-log procedures and openness issue have separate conclusions. The record gives both the findings date and the publication date.
<!-- /coolcode:guide -->

The first edition indexes 173 items in the OPC business-investigations catalogue, published April 20, 2001 through October 26, 2026. This is the selection the Commissioner lists publicly. It includes findings, case summaries, compliance letters and other document types. It cannot establish how often the OPC investigated a business or how often a complainant prevailed.

Search for a name as it appears in a title, subject term, report number or an annotated issue. Combine a document type, publication year and reviewed outcome. Eight issue-level annotations across four reports are editorial readings of the linked decision, including a distinct unnamed provider. An empty outcome filter searches all catalogue records. Selecting a specific outcome searches the reviewed issues only. Subsequent compliance letters can update an earlier report; follow both records for a current reading. Each reading-list entry keeps the source URL and dates, and the list exports locally as plain text.

[OPC business investigation publications](https://www.priv.gc.ca/en/opc-actions-and-decisions/investigations/investigations-into-businesses/). The weekly index update verifies pagination, unique URLs, dates and source counts. New outcome annotations require reading the original findings. To refresh, install lxml and run `python scripts/refresh.py`.

## Development

Run `node --test tests/*.test.mjs`, `python -m unittest discover -s tests` and `python scripts/build.py`. Submit reviewed data and code together. Every Pages deployment runs its desktop and mobile browser checks first.

<!-- schedule-reliability -->
## Schedule reliability

Public GitHub repositories can have scheduled workflows disabled after 60 days of inactivity. A separate weekly [schedule guard](.github/workflows/schedule-guard.yml) calls GitHub's enable-workflow API for an explicit list of refresh workflows and itself. It can restore workflows disabled for inactivity, preserves manually disabled workflows, and runs independently of collection failures.

This is an interim mitigation, not a scheduling guarantee: GitHub does not document active-workflow renewal as a permanent exemption, and scheduled runs can be delayed or dropped. A scheduler on our own Linux server is the planned independent trigger. The guard does not collect data, create dummy commits, or change source/check timestamps; successful collection and published data freshness still need monitoring.
<!-- /schedule-reliability -->
