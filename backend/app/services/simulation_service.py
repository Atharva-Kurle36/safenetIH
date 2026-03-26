import random

from app.services.dashboard_service import dashboard_telemetry


SIMULATION_SAMPLES = [
    {
        "type": "bank",
        "email_text": (
            "Subject: Urgent Bank Notice\n\n"
            "Dear Customer,\n"
            "We detected unusual activity on your account. Verify your password immediately "
            "using http://secure-bank-verify-login.com to avoid account suspension.\n\n"
            "Security Team"
        ),
        "explanation": [
            "Uses urgent language",
            "Contains suspicious link",
            "Requests sensitive info",
        ],
    },
    {
        "type": "job",
        "email_text": (
            "Subject: Congratulations! Selected for Remote Job\n\n"
            "Hello,\n"
            "You are pre-selected for a high-paying role. Click now to complete immediate onboarding "
            "and submit your bank details for salary processing: http://job-fast-track-now.com\n\n"
            "HR Desk"
        ),
        "explanation": [
            "Uses urgent language",
            "Contains suspicious link",
            "Requests sensitive info",
        ],
    },
    {
        "type": "security",
        "email_text": (
            "Subject: OTP Security Alert\n\n"
            "Dear User,\n"
            "Your account will be blocked immediately unless you confirm your OTP and password. "
            "Click now: http://secure-otp-check.com\n\n"
            "Support Center"
        ),
        "explanation": [
            "Uses urgent language",
            "Contains suspicious link",
            "Requests sensitive info",
        ],
    },
    {
        "type": "healthcare",
        "email_text": (
            "Subject: Updated Shift Roster - ICU Team\n\n"
            "Hello Team,\n"
            "The ICU shift roster for next week is now available on the hospital intranet. "
            "Please review your assigned shifts before 6 PM today.\n\n"
            "Operations Coordinator"
        ),
        "explanation": [],
    },
    {
        "type": "finance",
        "email_text": (
            "Subject: Payroll Adjustment Required Today\n\n"
            "Dear Employee,\n"
            "Your salary transfer is on hold. Reconfirm your account and PAN details immediately "
            "at http://payroll-adjustment-secure.net to avoid payment delays.\n\n"
            "Payroll Admin"
        ),
        "explanation": [
            "Creates urgency around salary processing",
            "Asks for sensitive financial identity details",
            "Uses non-official HTTP link",
        ],
    },
    {
        "type": "education",
        "email_text": (
            "Subject: Faculty Meeting Agenda - Q2 Review\n\n"
            "Hi Faculty,\n"
            "Attached is the agenda for Friday's curriculum meeting. "
            "Please add any department updates by EOD.\n\n"
            "Academic Office"
        ),
        "explanation": [],
    },
    {
        "type": "it-support",
        "email_text": (
            "Subject: VPN Certificate Expired - Action Needed\n\n"
            "Hello,\n"
            "Your VPN access has been suspended due to an expired certificate. "
            "Re-activate now using http://corp-vpn-cert-reset.com within 30 minutes.\n\n"
            "IT Helpdesk"
        ),
        "explanation": [
            "Suspicious domain impersonating internal IT support",
            "Time pressure tactic (30 minutes)",
            "HTTP link for credential recovery",
        ],
    },
    {
        "type": "manufacturing",
        "email_text": (
            "Subject: Preventive Maintenance Window - Line 3\n\n"
            "Team,\n"
            "Line 3 will be offline from 14:00 to 16:00 for preventive maintenance. "
            "No action is required from operators beyond standard lockout checklist.\n\n"
            "Plant Maintenance"
        ),
        "explanation": [],
    },
    {
        "type": "legal",
        "email_text": (
            "Subject: Confidential NDA Breach Notice\n\n"
            "You are named in an NDA breach complaint. Review legal evidence and sign acknowledgment "
            "at http://legal-escalation-casefiles.org immediately.\n\n"
            "External Counsel Desk"
        ),
        "explanation": [
            "Fear-based legal threat with immediate action demand",
            "Unknown external sender context",
            "Suspicious link requesting acknowledgment",
        ],
    },
    {
        "type": "retail",
        "email_text": (
            "Subject: Weekend POS Update Completed\n\n"
            "Hi Store Managers,\n"
            "The POS firmware patch was successfully deployed overnight. "
            "Please report only if billing terminals show sync errors.\n\n"
            "Retail IT Operations"
        ),
        "explanation": [],
    },
    {
        "type": "logistics",
        "email_text": (
            "Subject: Shipment Hold - Customs Penalty Pending\n\n"
            "Your container release is blocked. Submit immediate fee payment confirmation "
            "through http://customs-fast-clearance-pay.com to avoid demurrage charges.\n\n"
            "Port Documentation Unit"
        ),
        "explanation": [
            "Payment request with urgent penalty pressure",
            "Unofficial customs payment URL",
            "Generic sender identity",
        ],
    },
    {
        "type": "human-resources",
        "email_text": (
            "Subject: Open Enrollment Reminder\n\n"
            "Hello Team,\n"
            "Benefits enrollment closes this Friday. "
            "Use the employee portal bookmarked in the HR handbook to review your selections.\n\n"
            "People Operations"
        ),
        "explanation": [],
    },
    {
        "type": "government",
        "email_text": (
            "Subject: Tax Compliance Audit - Final Notice\n\n"
            "Immediate response required. Download your case file and verify director credentials at "
            "http://tax-audit-verification-gov.net before account seizure processing.\n\n"
            "National Revenue Cell"
        ),
        "explanation": [
            "Pretends to be a government authority",
            "Threatens account seizure to force quick action",
            "Fake government-style domain over HTTP",
        ],
    },
    {
        "type": "software",
        "email_text": (
            "Subject: Release Freeze Notice - Sprint 24\n\n"
            "Engineering Team,\n"
            "The release branch is frozen until QA signs off performance regressions. "
            "Please post blocker updates in the sprint channel by 5 PM.\n\n"
            "Product Delivery"
        ),
        "explanation": [],
    },
    {
        "type": "hospitality",
        "email_text": (
            "Subject: Vendor Invoice Mismatch - Immediate Settlement\n\n"
            "Dear Accounts Team,\n"
            "Settle overdue catering invoice now to prevent legal escalation. "
            "Confirm payment credentials at http://vendor-invoice-quickresolve.info\n\n"
            "Procurement Partner"
        ),
        "explanation": [
            "Urgent payment demand with legal pressure",
            "Suspicious external domain for payment workflow",
            "No verifiable vendor reference details",
        ],
    },
    {
        "type": "insurance",
        "email_text": (
            "Subject: Policy Renewal Confirmation\n\n"
            "Dear Customer,\n"
            "Your corporate medical policy has been renewed successfully for FY 2026-27. "
            "No action is needed unless nominee details have changed.\n\n"
            "Insurance Relationship Team"
        ),
        "explanation": [],
    },
    {
        "type": "insurance-fraud",
        "email_text": (
            "Subject: Claim Rejected - Upload KYC Immediately\n\n"
            "Your reimbursement claim is rejected. Upload Aadhaar and bank passbook now at "
            "http://claims-fasttrack-verify.net within 2 hours for reconsideration.\n\n"
            "Claims Escalation Unit"
        ),
        "explanation": [
            "Urgent timeline used to force rushed action",
            "Requests highly sensitive identity and banking documents",
            "Untrusted HTTP domain for document upload",
        ],
    },
    {
        "type": "pharma",
        "email_text": (
            "Subject: Batch Recall Advisory - Lot 9A\n\n"
            "Dear Distribution Partners,\n"
            "Please quarantine Lot 9A due to packaging defects and await reverse logistics instructions.\n\n"
            "Quality Assurance"
        ),
        "explanation": [],
    },
    {
        "type": "real-estate",
        "email_text": (
            "Subject: Tenant Escrow Verification Failure\n\n"
            "Finalize tenant escrow details now to prevent property listing suspension. "
            "Verify credentials at http://escrow-verify-propertyhub.co\n\n"
            "Leasing Compliance Desk"
        ),
        "explanation": [
            "Threatens suspension to create urgency",
            "Prompts credential verification on third-party link",
            "Domain does not match official company channels",
        ],
    },
    {
        "type": "transport",
        "email_text": (
            "Subject: Fleet GPS Maintenance Schedule\n\n"
            "All drivers,\n"
            "GPS firmware updates will run tonight between 11 PM and 1 AM. "
            "Vehicles may show delayed tracking updates during this window.\n\n"
            "Fleet Systems Team"
        ),
        "explanation": [],
    },
    {
        "type": "energy",
        "email_text": (
            "Subject: Grid Compliance Penalty Notice\n\n"
            "Regulatory non-compliance penalty has been issued. Submit executive login credentials at "
            "http://energy-compliance-instantresolve.com to close the case immediately.\n\n"
            "Regulatory Enforcement"
        ),
        "explanation": [
            "Pretends to be regulator requesting executive credentials",
            "Immediate resolution pressure",
            "Suspicious non-governmental domain",
        ],
    },
    {
        "type": "media",
        "email_text": (
            "Subject: Editorial Calendar Draft - April\n\n"
            "Hi Content Team,\n"
            "Attached is the April editorial calendar draft for review. "
            "Please add campaign priorities in the shared workspace before tomorrow's standup.\n\n"
            "Managing Editor"
        ),
        "explanation": [],
    },
    {
        "type": "telecom",
        "email_text": (
            "Subject: SIM KYC Suspension Alert\n\n"
            "Your enterprise SIM pool will be deactivated due to incomplete KYC. "
            "Re-validate employee IDs and OTP credentials at http://sim-kyc-urgent-fix.com now.\n\n"
            "Network Verification Cell"
        ),
        "explanation": [
            "Urgent service deactivation warning",
            "Requests OTP and identity credentials",
            "Suspicious KYC link outside official portal",
        ],
    },
    {
        "type": "agriculture",
        "email_text": (
            "Subject: Irrigation Sensor Calibration Notice\n\n"
            "Dear Field Officers,\n"
            "Moisture sensors in North Zone will undergo calibration this Thursday. "
            "Please hold automated watering rules between 10 AM and 12 PM.\n\n"
            "AgriTech Operations"
        ),
        "explanation": [],
    },
    {
        "type": "construction",
        "email_text": (
            "Subject: Contractor Insurance Expired - Site Access Blocked\n\n"
            "Site badges are blocked pending insurance renewal validation. "
            "Upload policy and payment proof at http://site-access-insurance-clearance.info urgently.\n\n"
            "Project Access Office"
        ),
        "explanation": [
            "Access-block pressure to trigger immediate action",
            "Requests policy/payment proof through unverified portal",
            "Non-official domain with urgency language",
        ],
    },
]


_shuffled_pool: list[dict[str, object]] = []


def _next_shuffled_sample() -> dict[str, object]:
    global _shuffled_pool
    if not _shuffled_pool:
        _shuffled_pool = SIMULATION_SAMPLES.copy()
        random.shuffle(_shuffled_pool)

    return _shuffled_pool.pop()


def generate_simulated_email() -> dict[str, object]:
    sample = _next_shuffled_sample()
    dashboard_telemetry.record_simulation_generated()
    return sample
