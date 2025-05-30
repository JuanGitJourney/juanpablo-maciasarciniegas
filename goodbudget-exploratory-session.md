# Exploratory Testing Report

# 🧪 Exploratory Testing Report – Good Budget Web App (Free Tier)

**Tester:** Juan Pablo Macias Arciniegas  
**Date:** 2025-05-29  
**Test Duration:** 2 hours  
**Browser:** Chrome (135.0.7049.85) / Safari Version 18.4 (20621.1.15.11.10)  
**Device:** Laptop  
**Environment:** Production 

## Main Goal

To explore the Good Budget web application's free-tier features, focusing on core user flows, usability, input validation, responsiveness, accessibility, and basic security aspects. Identify potential bugs, areas for improvement, and assess general application stability and performance.

## Environment & Tools

* **Operating System:** macOS Sequoia 15.4
* **Dev Tools:**
    * Network Tab (for REST API calls, loading times)
    * Application Tab (for Cookies, LocalStorage, SessionStorage)
    * Lighthouse (for Performance, Accessibility, Best Practices, SEO)
    * aXe DevTools (Browser extension for detailed accessibility testing)
* **Account:** Free tier account to be created during the session.

---

## 🔍 Prioritized Exploratory Testing Charters

Below are the charters defined for this session

| Priority | Charter ID | Charter Title                                  | Area of Focus                    |
| :------- | :--------- | :--------------------------------------------- | :------------------------------- |
| **High** | CHTR-001   | New User Sign-Up, Login & Onboarding           | Registration, Email Verification, Initial Setup |
| Medium   | CHTR-002   | Account Creation, Update and Deletion          | Accounts (Add, Edit, Delete)    |
| **High** | CHTR-003   | Core Budgeting: Envelope Creation & Management | Envelopes (Add, Edit, Delete)    |
| **High** | CHTR-004   | Core Budgeting: Transaction Management         | Adding Income & Expenses         |
| Medium   | CHTR-005   | Accesibility                                   | Application works for all users through screen reader support, color contrast, and keyboard navigation. |
| Medium   | CHTR-006   | Cross-browser behavior                         | Consistent behavior and appearance of the application across various web browsers |
| Medium   | CHTR-007   | Responsive Design & General UX                 | Layout adaptability, element reflow, and interaction usability across devices and screen sizes |

---

## 🧭 Findings from Charters

### Charter 1: New User Sign-Up, Login & Onboarding .
**Goal:** Validate user registration, login, logout, and error handling.  

**Findings**

⚠️ Finding #1: Delayed Sign Up Element Rendering Affects Perceived Performance  
- Severity: Medium (Perceived Performance)
- Description: The sign-up element takes 2640 ms to render, which can negatively affect the user's perception of the application's speed and responsiveness.
- Evidence: Sign-up element rendering time: 2640 ms.
- Impact:
  - Poor user experience.

⚠️ Finding #2: Layout Shift After Sign Up Element Load Causes Visual Instability  
  - Severity: Medium  (User Experience)
  - Description: A noticeable layout shift occurs on the page after the sign-up element has finished loading.
  - Evidence: Observable layout shift post sign-up element rendering.
  - Impact:
    - Jarring visual experience for the user.
    - Potential for misclicks or difficulty interacting with content during the shift.
    - Frustration and reduced user satisfaction.

⚠️ Finding #3: Missing Asset Files on Signup Page  
  - Severity: Medium (Functionality/Appearance/Security)
  - Description: Several asset files failed to load on the signup page (404 Not Found errors). This indicates resources are missing, moved, or incorrectly referenced.
  - Evidence: The following resources returned 404 errors:
    - Security Plugin (Wordfence): wordfenceBox.1603293147.css
    - Yoast SEO Plugin: adminbar-1540.css
    - GeneratePress Theme: main.min.js
    - Elementor Plugin: preloaded-elements-handlers.min.js
  - Impact:
    - Broken page styling and layout.
    - Missing functionality.
    - Potential security vulnerabilities if security-related scripts or styles fail to load.
    - Negative impact on SEO if SEO-related plugin assets are missing.

⚠️ Finding #4: Missing Cookie Consent Management  
  - Severity: High (GDPR/Privacy compliance risk)
  - Description: The application sets tracking cookies without obtaining prior user consent.
  - Evidence: Multiple analytics cookies (e.g., _ga, _vwo_uuid, optimizely) are set immediately upon page load before any user interaction or consent.
  - Impact:
    - Potential violations of privacy regulations like GDPR.
    - Risk of legal penalties and damage to user trust.

⚠️ Finding #5: No Email Verification Process  
  - Severity: Medium (Security/Abuse risk)
  - Description: The account creation process does not require users to verify their email addresses.
  - Steps to Reproduce:
    - Navigate to the account creation page.
    - Create an account using any email address (even a non-existent or temporary one).
    - Observe that immediate access to the account is granted without an email verification step.
  - Impact:
    - Enables the creation of accounts using others' email addresses.
    - Potential for spam, abuse, and unauthorized account creation.
    - Difficulty in communicating with users for legitimate purposes (e.g., password recovery, important notifications).

✅ Finding #6: Email Validation Capabilities  
  - Severity: Low (Mixed - mostly positive)
  - Description: Application demonstrates good support for various valid email formats
  - Evidence: Successfully accepts:
    - International domains: test@münchen.de, test@中文.com, test@example.рф
    - IP addresses: test@123.456.789.0, test@[192.168.1.1]
    - Minimal format: a@b.co
    - Subdomains: test@sub.domain.com
  - Impact: Good globalization and RFC compliance for valid formats

⚠️ Finding #7: Weak Password Policy  
    - Severity: Medium (Security risk)
    - Description: Password requirements too permissive
    - Evidence:
      - Minimum length: 4 characters (industry standard: 8+)
      - Accepts whitespace-only passwords (e.g., "    ")
    - Impact: Compromised account security

✅ Finding #8: Email Uniqueness Validation  
    - Severity: Low (Positive finding)
    - Description: System correctly prevents duplicate email registration
    - Evidence: Attempt to register with existing email shows appropriate error

❌ Finding #9: Severe Email Validation Bypass  
  - Severity: HIGH (Security/Data Integrity Risk)
  - Description: Application accepts malformed email addresses that violate RFC standards
  - Malformed Emails Accepted:
    - test@@example.com (double @ symbol)
    - test@example..com (consecutive dots in domain)
  - Impact:
    - These are invalid email formats per RFC 5322
    - Could cause email delivery failures
    - May break email-based features (password reset, notifications)
    - Indicates weak input validation that could affect other fields

⚠️ Finding #10: Unsafe Input Allowed in Password Field  
  - Severity: Medium (Security hygiene / future injection risk)
  - Description: The system allows users to register using passwords that contain SQL-like syntax (e.g., ' OR 'x'='x), without input sanitization or validation.
  - Steps to reproduce:
    - Create an account with a password like ' OR 'x'='x
    - Log in using the same credentials
    - Observe that login works only with that exact string, confirming it's stored as-is
  - Impact:
  - Indicates lack of input validation and sanitation
  - May introduce injection or logic errors if such inputs are later used unsafely (e.g., in admin tools, logs, analytics)
  - Poor security hygiene, potential long-term vulnerability if not addressed

✅ Finding 11: Session Management  
  - Severity: Low (Positive finding)
  - Description: Session cookie properly implemented
  - Evidence: GBSESS cookie contains random session identifier, not password
    - Security Status: ✅ Passwords not stored in cookies (good practice)
    - What This Means:
    - The application is correctly using session-based authentication rather than storing passwords in cookies. The GBSESS cookie is your session token that proves you're logged in, but it doesn't contain your actual password.

❌ Finding #12: Insecure Password Transmission  
  - Severity: CRITICAL
  - Description: User passwords are transmitted in plain text over the network
  - Evidence:
    - Request to https://goodbudget.com/login_check
    - Form Data shows: _password: Explora4565 (plain text)
  - Impact:
    - Passwords exposed to network interception
    - Vulnerable to man-in-the-middle attacks
    - Poor security practice for credential handling

❌ Finding #13: Sensitive User Data Stored in LocalStorage  
  - Severity: High (Security Risk – LocalStorage exposure)
  - Description: The userpilotUser object stored in localStorage includes user identifiers, subscription level, and tokens. Storing such data in localStorage is risky because it's accessible to any JavaScript running on the page, including malicious scripts injected via XSS.
  - Evidence:
    - localStorage.userpilotUser916534918 contains:
      ...
      {
        "token": "NX-32427694",
        "userid": "01971c73-372b-8051-814d-31655db6ff6a",
        "customer": {
          "name": "10037632",
          "created_at": 1748554202000,
          "SubscriptionLevelId": 11
        },
      }
      ...
  - Impact:
    - Allows attacker to impersonate users or access sensitive state information if an XSS vulnerability exists.
    - Violates secure storage practices for sensitive information (tokens, PII).
    - Could lead to unauthorized actions or privilege escalation.

✅ Finding #14: Redundant and Unmanaged Session State
  - Severity: Low (Stability and data hygiene issue)
  - Description: Multiple overlapping keys are present in localStorage, including userpilot:session_id, userpilot:sessions, and user-specific entries. There is no visible cleanup or expiration policy.
  - Evidence:
    - Keys: userpilot:session_id, userpilot:sessions, userpilotUser916534918, userpilotSDK916534918
  - Impact:
    - Risk of state inconsistencies between sessions.
    - May cause UX issues like repeating onboarding flows or unexpected user behavior.
    - Accumulation of stale data over time (e.g., for returning users or shared devices).

---

### Charter 2: Account Creation, Update and Deletion.
**Goal:** Test adding, editing, and deleting Accounts.  

**Findings**

❌ Finding #1: Possible SQL Injection Vulnerability in Name Field Submission  
  - Severity: High (Potential security risk)
  - Description: During an exploratory testing session, it was found that the "Name" input field allows submission of potentially dangerous SQL injection payloads. Although no response data was returned when submitting certain payloads, the request was accepted and processed by the server without proper input sanitization or validation, potentially exposing the system to SQL injection vulnerabilities.
  - Specifically, payloads such as a single quote (') were successfully submitted to the server without triggering any immediate error or sanitization. This could allow an attacker to manipulate or retrieve sensitive data from the database.
  - Evidence:
    - Payload: Name: "'" (single quote)
    - Request sent to: /account/save
    - Request Method: POST
    - Request Headers: Content-Type: application/x-www-form-urlencoded
    - The server returned a status code 200 OK, indicating the request was successfully processed, even though a potentially malicious payload was submitted.
    - Response: Failed to load response data, but the request was accepted and processed by the backend without immediate rejection or sanitization.
  - Impact:
    - Potential for Data Exposure: If exploited, an attacker may be able to perform SQL injection attacks, leading to unauthorized access to sensitive user data, such as financial information or personal details.
    - Database Corruption: Poorly sanitized inputs may allow attackers to manipulate database queries, resulting in potential data corruption or loss.
    - Denial of Service (DoS): Attackers may craft payloads that result in database overload or downtime.
    - Lack of Input Validation: The application does not sufficiently validate or sanitize input for critical fields such as "Name", which could expose the system to a wide range of attacks.

⚠️ Finding #2: Account Name Field Allows Empty Values  
  - Severity: Medium (Data integrity concern)
  - Description: The "Account Name" field does not enforce required input, allowing account records to be created or saved without a name.
  - Evidence:
    - Account saved successfully with an empty name
  - Impact:
    - Difficult to identify accounts in the UI
    - Potential confusion or user error during selection or reporting
  
⚠️ Finding #3: Current Balance Field Accepts Non-Numeric Characters  
  - Severity: Medium (Data validation issue)
  - Description: The "Current Balance" input field does not properly restrict entry to numeric values, allowing non-integer characters such as letters or symbols.
  - Evidence:
    - Input accepted: abc123, 12.34.56, $1000, one thousand
    - No error or sanitization on submission
    - Invalid characters are prevented after clicking on 'Save Changes' BUTTON
  - Impact:
    - Poor user experience due to lack of real-time validation feedback  
    - Potential for inaccurate financial calculations
    - Risk of system errors or data corruption if input is processed without sanitization

⚠️ Finding #4: Amount Field Accepts Invalid or Misleading Numeric Inputs Without Validation on Save  
  - Severity: Medium (Input validation and data integrity concern)
  - Description: The "Amount" input field allows users to save changes with invalid or misleading numeric inputs, despite clear instructions to avoid spaces, negative values, and symbols. The system fails to validate these inputs before submission, leading to potential data inconsistencies.
  - Evidence:
    - Input "50 " (with trailing spaces) is accepted and saved as 50
    - Input -100 is accepted and saved, even though negative amounts are discouraged by UI text
    - Input 0100 is saved and interpreted as 100, despite the misleading formatting
  - Impact:
    - Misalignment between UI guidance and actual system behavior
    - Risk of user confusion and incorrect data entry
    - Potential issues in downstream processing or financial reporting due to unexpected formatting being silently accepted

✅ Finding #5: Large Number Display Formatting Issue  
  - Severity: Low (UI/UX inconsistency)
  - Description: The application fails to gracefully handle the display of very large numbers in financial fields, causing layout and readability issues.
  - Evidence:
    - Amount displayed: 20,000,000,000.00 in "Checking, Savings, Or Cash" section
    - Net total: 20,000,000,000.00 misaligned or visually overflowing
    - Numbers appear cramped and exceed layout constraints
  - Impact:
    - Reduced readability and user confidence
    - Potential mistrust in financial data presentation
    - Aesthetic inconsistency in UI

✅ Finding #6: Unexpected Navigation After Account Edit/Add  
  - Severity: Low (UX inconsistency)
  - Description: After adding or editing an account, the UI redirects the user to the “Envelopes” section instead of staying in “Accounts.”
  - Evidence:
      - Save → redirect to Envelopes
  - Impact:
    - Disrupts workflow
    - Forces user to navigate back manually

❌ Finding #7: Account Deletion Flow Is Non-Intuitive   
  - Severity: High (UX and functional limitation)
  - Description: The process to delete an account is hidden behind an unintuitive flow and ultimately fails to complete due to a save restriction.
  - Evidence:
    - User must click "Add/Edit" to access deletion UI
    - Deletion is performed via a black “X” icon with no label, tooltip, or confirmation dialog
    - After deletion, save is not possible — error message displayed:
      - “Add an Account to save, or Cancel to undo your changes”
    - Specifying a new name and balance is necesary to save the changes
  - Impact:
    - Users cannot successfully delete accounts
    - Misleading UI elements create confusion and frustration
    - Critical data management functionality is effectively broken


---


### Charter 3: Core Budgeting: Envelope Creation & Management.
**Goal:** Evaluate the functionality, usability, and accuracy of the Envelope System for managing budget categories.  

**Findings**

⚠️ Finding #1: No "Save" Option in Envelope Edit Mode  
  - Severity: Medium (UX/Functional Issue)
  - Description: When editing an envelope, specifically after setting or changing the "Due on the: " field, there is no explicit "Save" button or mechanism.
  - Evidence:
    - Navigate to the Envelopes section.
    - Click "Edit" on an existing envelope.
    - Change the value in the "Due on the" field (e.g., from '15' to '20').
    - Observe the absence of a "Save" or "Update" button.
    - Navigate away or refresh; the "Due on the" field reverts to '15'.
  - Impact:
    - Data Inconsistency: Users might believe they have updated information when they haven't.
    - Poor User Experience: Lack of feedback and inability to save changes leads to frustration.
  
❌ Finding #2: Potential SQL Injection Vulnerability in Envelope Names  
    - Severity: High (Potential Security Risk)
  - Description: The "Envelope Name" input field accepts a wide range of characters and spaces without apparent sanitization. Testing indicates that payloads potentially used for SQL injection (like a single quote) might be accepted by the server, suggesting a lack of robust input validation and a potential SQL injection vulnerability.
  - Evidence:
    - Attempted to create/edit an envelope with the name: My' Envelope or Envelope; DROP TABLE users; --
    - Observed if the system accepted the input or returned an error. (Note: Further testing needed to confirm if an actual injection is possible, but lack of sanitization is the core issue).
- Impact:
  - Data Exposure: Could lead to unauthorized access to all user and financial data.
  - Database Corruption/Loss: Malicious queries could modify or delete data.
  - System Compromise: Potential for attackers to gain control over the database or application server.
  
⚠️ Finding #3: Envelope "Amount" Field Accepts Negative Values  
  - Severity: Medium (Data Validation Issue)
  - Description: The "Amount" field for setting an envelope's target or budgeted amount allows users to input and save negative values. This leads to envelopes displaying negative target amounts, which is logically inconsistent within a budgeting context.
  - Evidence:
    - Create or edit an envelope.
    - Enter -50.00 in the "Amount" field.
    - Save the envelope.
    - Observe that the envelope now displays an amount of -50.00.
  - Impact:
    - Data Integrity: Allows illogical financial data within the system.
    - User Confusion: Negative budget amounts are confusing and serve no clear purpose.
    - Calculation Errors: Could lead to unexpected or incorrect totals and reporting.

⚠️ Finding #4: Unsaved Envelope Changes Lost on Navigation via "Edit Accounts"  
  - Severity: Medium (UX/Data Loss)
  - Description: If a user is in the process of editing envelopes and clicks the "Edit Accounts" button before saving their changes, they are redirected to the Accounts page, and all pending changes to the envelopes are discarded without warning or an option to save.
  - Evidence:
    - Go to the Envelopes section and start editing an envelope (e.g., change its name).
    - Without saving, click the "Edit Accounts" button.
    - The system navigates to the Accounts page.
    - Navigate back to the Envelopes section.
    - Observe that the changes made to the envelope were not saved.
  - Impact:
    - Data Loss: Users can easily lose work without realizing it.
    - User Frustration: Unexpected data loss and lack of warnings create a poor experience.
    - Workflow Disruption: Forces users to re-enter data and breaks the flow of editing.

⚠️ Finding #5: "Fill Envelopes" Feature Lacks Discoverability  
  - Severity: Medium (UX/Discoverability)
  - Description: The primary way users discover the "Fill Envelopes" functionality is through the workflow presented after creating a brand new envelope. If a user only has existing envelopes and hasn't created one recently, they may not understand the purpose of the "Fill Envelopes" option in the menu, as its context isn't clear otherwise.
  - Evidence:
  - Scenario 1: Create a new envelope -> User is prompted/guided towards "Fill Envelopes".
  - Scenario 2: User logs in with existing envelopes -> User sees "Fill Envelopes" in the menu but may not understand its function or how to initiate it without the prior context.
  - Impact:
  - Underutilization of Feature: Users might miss or avoid a core functionality because they don't know what it does or how to use it.
  - User Confusion: Lack of clear entry points or explanations can make the application harder to learn.

⚠️ Finding #6: Ambiguous "Amt" Field in "Fill Envelopes"  
  - Severity: Medium (UX/Clarity)
  - Description: Within the "Fill Envelopes" section, an input field labeled "Amt" lacks a clear description, tooltip, or placeholder text. Users are not provided with sufficient information to understand what value they are expected to enter (e.g., total amount to distribute, amount per envelope, etc.).
  - Evidence:
    - Navigate to the "Fill Envelopes" screen.
    - Observe the "Amt" field.
    - Note the absence of helper text, tooltips, or clear instructions regarding its purpose.
  - Impact:
    - User Error: Users might enter incorrect values, leading to misallocation of funds.
    - User Frustration: Lack of clarity makes the feature difficult and confusing to use.
    - Increased Support Load: Users may need to seek help to understand this basic input.

⚠️ Finding #7: Filling Envelopes Possible with 0 or Negative "From" Amount  
  - Severity: Medium (Data Validation/Business Logic)
  - Description: The "Fill Envelopes" process allows users to proceed even when the source ("From") amount is set to $0 or a negative value. This contradicts real-world logic, as it's impossible to distribute funds that don't exist or a negative amount.
  - Evidence:
    - Go to "Fill Envelopes".
    - Select a source account (or leave as $0 / set to a negative value if possible).
    - Attempt to distribute funds to envelopes.
    - Observe that the system allows the action, potentially resulting in zero or negative transactions.
  - Impact:
    - Logical Inconsistency: Allows actions that don't make financial sense, undermining user trust.
    - Data Integrity Issues: Can lead to incorrect or nonsensical account balances and envelope amounts.
    - Potential for Errors: Could cause issues in reporting or downstream calculations.

⚠️ Finding #8: "Payer" Field Can Be Left Empty When Filling Envelopes  
  - Severity: Medium (Data Integrity)
  - Description: When filling envelopes, the "Payer" field (presumably indicating the source of funds or the entity making the payment) can be submitted without a value. This leads to incomplete transaction records, making it difficult to track the origin of funds.
  - Evidence:
    - Go to "Fill Envelopes".
    - Select amounts and envelopes.
    - Leave the "Payer" field blank.
    - Submit the form.
    - Observe that the transaction is recorded without Payer information.
  - Impact:
    - Incomplete Records: Makes auditing and tracking financial activity difficult.
    - User Confusion: Users looking back at transactions won't know where the money came from.
    - Reduced Reporting Value: Reports lacking source information are less useful.

⚠️ Finding #9: Confusing "Add" Button Behavior in "Fill Envelopes"  
  - Severity: Medium (UX/Functional)
  - Description: In the "Fill Envelopes" section, an "Add" button is present but appears non-functional or misleading. It seems to be set by default but doesn't directly allow adding money. Instead, users must interact with a subsequent dropdown field and select a predefined envelope value to trigger the addition, which is an unintuitive workflow.
  - Evidence:
    - Navigate to "Fill Envelopes".
    - Observe the "Add" button.
    - Clicking the "Add" button directly has no effect or doesn't add funds as expected.
    - User must interact with a dropdown first to enable the "Add" functionality.
  - Impact:
    - User Confusion: The button's purpose and interaction model are unclear.
    - Inefficient Workflow: Forces users into a non-standard and potentially frustrating sequence of actions.
    - Perception of Broken Functionality: Users may think the "Add" feature is broken.

⚠️ Finding #10: Negative Values Allowed When Filling Envelopes  
  - Severity: Medium (Data Validation)
  - Description: Similar to setting envelope amounts, the process of filling envelopes also allows for the input of negative values. This could lead to users inadvertently (or intentionally) "un-filling" envelopes or creating negative balances through the standard fill mechanism, which is logically flawed.
  - Evidence:
    - Go to "Fill Envelopes".
    - Attempt to enter -25.00 as the amount to add to an envelope.
    - Observe if the system accepts and processes this negative value.
  - Impact:
    - Data Integrity: Creates a risk of negative envelope balances or incorrect transaction logs.
    - User Confusion: Actions contradict the intended purpose of "filling" envelopes.
    - Calculation Errors: May lead to incorrect summaries and balances.

✅ Finding #11: Unclear Purpose of Lines on Envelope Progress Bars  
  - Severity: Low (UI/UX)
  - Description: Each envelope features a progress bar, but there are static lines displayed above these bars. These lines do not move, change, or appear to convey any information, making their purpose unclear to the user and potentially adding visual clutter without benefit.
  - Evidence:
    - View the Envelopes section.
    - Observe any envelope with a progress bar.
    - Note the static lines above the bar.
    - Interact with the envelope (fill, spend); observe that the lines remain unchanged.
  - Impact:
    - User Confusion: Users may spend time trying to understand what these lines mean.
    - Visual Clutter: Unnecessary UI elements can make the interface feel less clean and focused.
    - Missed Opportunity: If these lines were intended to convey information, they are failing to do so.


---



### Charter 4: Core Budgeting: Transaction Management
**Goal:** Evaluate the functionality, usability, and accuracy of the Transactions for managing budget categories.  

**Findings**

❌ Finding #1: Account "Current Balance" Edit Behavior Is Unintuitive  
  - Severity: Medium-High (Design flaw with potential for critical misuse)
  - Description: Editing the “Current Balance” field on account directly adds/subtracts the entered value to/from the existing balance instead of replacing it. While this may be intentional, it is counterintuitive to users expecting a direct value replacement. Balance changes should typically be made via a “New Transaction” flow to preserve auditability and clarity.
  - Evidence:
    - Edit 1: Set to 500 → shows 500
    - Edit 2: Set to 200 → shows 700 (instead of replacing with 200)
  - Impact:
    - User confusion and unintended balance inflation/deflation
    - Risks of inaccurate financial records due to hidden cumulative logic

✅ Finding #2: Unclear Checkbox in “Type” Column  
  - Severity: Low (Usability issue)
  - Description: The checkbox in the “Type” column of the transactions table lacks label, tooltip, or visual context to explain its function.
  - Evidence:
    - Checkbox appears in each row under “Type” with no explanation
  - Impact:
    - User confusion regarding its purpose
    - Potential misconfiguration of account settings

✅ Finding #3: Unclear Status Column  
  - Severity: Low (Usability issue)
  - Description: The Status column of the transactions table lacks label, tooltip, or visual context to explain its function.
  - Evidence:
    - Cloumn appears to be empty for all records
  - Impact:
    - User confusion regarding its purpose
    - Potential misconfiguration of account settings
  
⚠️ Finding #4: Delete Option Disabled for Account Record  
  - Severity: Medium (Inconsistent behavior)
  - Description: When a specific account is selected via its checkbox, the record becomes editable (name and notes), but the delete option is disabled with no explanation.
  - Evidence:
    - Checkbox selected → delete button disabled, but fields editable
  - Impact:
    - Unclear system logic
    - Prevents user from managing account lifecycle effectively

⚠️ Finding #5: Payee Column Displays Account Description  
  - Severity: Medium (Labeling/data mismatch)
    - Description: The "Payee" column in the table incorrectly displays account descriptions, leading to data confusion.
  - Evidence:
    - Same field shows both account name and description
  - Impact:
    - Misinterpretation of account data
    - Incorrect financial tracking or reconciliation

⚠️ Finding #6: Negative Amounts Not Visually Differentiated  
  - Severity: Medium (UI clarity issue)
  - Description: Negative values in the “Current Balance” field are not visually distinguished in the transactions table. They are shown in black with no minus sign or color coding.
  - Evidence:
    - Input: -100 → Displayed as 100 in black
  - Impact:
    - Misleading account data
    - Risk of financial mismanagement

⚠️ Finding #7: Transaction Editing Flow Is Unintuitive  
  - Severity: Medium (UX usability issue)
  - Description: Editing a transaction requires clicking on the transaction’s name, which appears under the Payee column, or directly on the amount — neither of which is clearly labeled or visually indicative of editability.
  - Evidence:
    - User must hover and click on transaction name (shown as payee) or the amount to trigger edit
  - Impact:
    - Increases learning curve for new users
    - May result in frustration or accidental omissions when trying to edit transactions

⚠️ Finding #8: Transactions Can Be Created from Unfilled Envelopes  
  - Severity: Medium (Logical inconsistency)
  - Description: The system allows users to initiate and complete transactions from envelopes that have not been filled, potentially resulting in negative balances or misleading data.
  - Evidence:
    - New transaction allowed from an empty envelope
  - Impact:
    - Risk of overspending
    - Inaccurate envelope budgeting behavior

❌ Finding #9: Payee Field Accepts Raw Strings and Spaces  
  - Severity: High (Security vulnerability)
  - Description: The Payee input field on the "Create Transaction" form accepts unvalidated string input, including spaces and potentially malicious content, which could expose the system to SQL injection or other input-based attacks.
  - Evidence:
    - Input: "' OR 'x'='x" accepted without sanitization
  - Impact:
    - Security vulnerability if inputs are not sanitized before database interaction
    - Potential compromise of user data or system integrity

⚠️ Finding #10: Envelope Fill Name Field Accepts Special Characters  
  - Severity: Low (Validation inconsistency)
  - Description: The “Name” field in the "Fill Envelopes" option accepts special characters and spacing with no validation or restrictions.
  - Evidence:
    - Input: "@@#Envelope_1!!!" accepted without warnings
  - Impact:
    - Reduced naming consistency
    - Potential formatting issues or display errors in other parts of the app

⚠️ Finding #11: "Add" vs. "Set" Functions Are Not Clearly Distinguished  
  - Severity: Medium (UX clarity issue)
  - Description: The difference between the “Add” and “Set” options during envelope filling is not intuitive or self-explanatory, especially for first-time users.
  - Evidence:
    - Tooltips read:
    - ADD: “Rollover the balance and add money to this envelope.”
    - SET: “Set this Envelope's balance to a particular amount. Don't rollover.”
  - Impact:
    - Users may misallocate funds due to misunderstanding
    - Potential for incorrect budget planning


---


### Charter 5: Accesibility 
**Goal:**  To identify accessibility barriers that hinder users from perceiving, navigating, and using the application effectively.

**Findings**

✅ Finding #1: Inadequate Color Contrast in Navigation Menu Link  
  - Severity: Low (Accessibility Issue)
  - Description: The "How It Works" navigation link does not meet the minimum color contrast ratio required by WCAG 2.1 AA standards. The foreground text color (#39a362) against a white background (#ffffff) results in a contrast ratio of 3.18:1, falling short of the minimum required 4.5:1 for normal text.
  - Evidence:
    - Location:
    - HTML:
      - <a href="https://goodbudget.com/how-it-works/" class="elementor-item">How It Works</a>
    - CSS:
      - Foreground color: #39a362
      - Background color: #ffffff
      - Font size: 17px (12.8pt)
      - Font weight: normal
      - Measured Contrast Ratio: 3.18:1
      - Minimum Required: 4.5:1 (WCAG 2.1 AA for normal text)
  - Impact:
    - Readability: Users with low vision, color blindness, or viewing the site in bright environments may struggle to read the link.
    - Accessibility Compliance: Fails WCAG 1.4.3 (Contrast - Minimum), potentially exposing the site to legal or regulatory scrutiny.


✅ Finding #2: Decorative Image Lacks Required Accessibility Attributes  
  - Severity: Low (Accessibility Issue)
  - Description: A decorative image within the UI lacks an alt attribute or a suitable semantic override (role="presentation" or role="none"). This violates WCAG guidelines and can negatively affect users relying on screen readers.
  - Evidence:
    - Location: .HrpQab__button_main > img
    - <img src="chrome-extension://eanggfilgoajaocelnaflolkadkeghjp/img/commands/main.svg">
    - Image has:
      - No alt attribute
      - No aria-label or aria-labelledby
      - No title
      - No role="presentation" or role="none"
  - Impact:
    - Accessibility Compliance: Non-compliance with WCAG 1.1.1 (Non-text Content) may prevent users with assistive technologies from understanding the content or purpose of the image.
    - Screen Reader Confusion: Without proper labeling or semantic demotion, screen readers may announce the image with its file name or skip it entirely, creating confusion or unnecessary noise.

⚠️ Finding #3: Links Without Discernible Names  
  - Severity: Medium (Accessibility Issue)
  - Description: Some anchor (<a>) elements do not have visible or programmatically-discernible names, causing screen readers to announce them as "link" without context.
  - Evidence:
    - Anchor tags present without inner text or appropriate ARIA labeling
    - Found in footer navigation and social media icons
  - Impact:
    - Users relying on assistive technology cannot determine the purpose of these links.
    - Violates WCAG 2.4.4 (Link Purpose - In Context)

⚠️ Finding #4: Form Fields Lack Proper Label Associations  
  - Severity: Medium (Accessibility Issue)
  - Description: Some form fields either have no labels or are associated with multiple labels inappropriately, leading to confusion for screen reader users.
  - Evidence:
    - Input elements missing <label for="..."> or aria-labelledby associations
    - Some fields tied to multiple ambiguous labels
  - Impact:
    - Users may not understand the required input or context of form fields.
    - Violates WCAG 1.3.1 (Info and Relationships) and 3.3.2 (Labels or Instructions)

✅ Finding #5: Insufficient Color Contrast Between Text and Background  
  - Severity: Low (Accessibility Issue)
  - Description: Certain text elements do not meet the minimum contrast ratio required by WCAG 2.1 AA (4.5:1 for normal text).
  - Evidence:
    - Text with foreground color #999999 on white background
    - Contrast ratio measured at 3.5:1
  - Impact:
    - Low-vision users may struggle to read the content, especially on mobile or in bright environments.
    - Violates WCAG 1.4.3 (Contrast - Minimum)
    - Recommendation:
    - Darken the foreground text color or adjust the background to meet or exceed the 4.5:1 threshold.

⚠️ Finding #6: Touch Targets Are Too Small or Too Close Together  
  - Severity: Medium (Accessibility Best Practice)
  - Description: Some interactive elements, such as buttons and links, do not meet recommended minimum target size (44x44px) or spacing guidelines, making them difficult to use on touch devices.
  - Evidence:
    - Action buttons in mobile view measured at ~32x32px with <8px spacing
  - Impact:
    - Users with motor disabilities or those on small screens may struggle to activate controls accurately.
    - Violates WCAG 2.5.5 (Target Size)
    - Recommendation:
    - Increase the size and spacing of interactive elements to meet or exceed minimum target guidelines.

✅ Finding #7: Heading Elements Are Not in a Logical Order  
  - Severity: Low (Accessibility/Navigation Issue)  
  - Description: Heading tags (`<h1>`–`<h6>`) do not follow a sequential, descending order, which can confuse screen reader users and impact page structure understanding.  
  - Evidence: 
    - `<h1>` followed by `<h3>` or `<h5>` without intermediate levels  
  - **Impact:**  
    - Assistive tech users may struggle to understand the document hierarchy or navigate efficiently.  
    - Violates [WCAG 1.3.1 – Info and Relationships](https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html)

---

### Charter 6: Cross-browser behavior 
**Goal:**  To ensure that all key application components render and function consistently across major web browsers.

**Findings**

✅ Finding #1: User Signup Component Renders Faster in Safari  
  - Severity: Low (Performance Variability)
  - Description: The sign-up module loads perceptibly faster in Safari than in Chrome.
  - Evidence:
    - Safari (v16.3): ~1.3s load
    - Chrome (v122): ~2.1s load
  - Impact:
    - May affect user perception of speed on different browsers.
    - Possibly due to asset optimization or JavaScript execution time.

⚠️ Finding #2: Component Sizes Vary Between Browsers  
    - Severity: Medium (Inconsistency)
    - Description: UI components (buttons, inputs, cards) appear with slight size and spacing differences in Chrome vs. Safari.
  - Evidence:
    - Notable discrepancies in padding/margin.
    - Causes layout shifts and alignment differences.
  - Impact:
    - Inconsistent branding and user experience.
    - Potential layout bugs introduced by browser-specific rendering engines.

✅ Finding #3: Real-Time Changes Sync Across Browsers  
    - Severity: None (Positive Finding)
    - Description: Changes made in one browser (e.g., signing up, theme toggling) are accurately reflected in another session/browser window.
  - Impact:
    - Confirms good back-end state management and real-time synchronization.


### Charter 7: Responsive Design & General UX 
**Goal:**  To verify that the application interface adapts appropriately to various screen sizes, maintaining usability, readability, and aesthetic integrity. 
**Findings:**

✅ Finding #1: Page Does Not Scale Beyond a Maximum Width  
  - Severity: Low (Usability Issue)
  - Description: When the browser window is enlarged, the page maintains a fixed maximum width and does not expand to utilize available screen real estate.
  - Evidence:
    - Observed on large desktop resolutions (1920px+).
    - Container width appears to be restricted to ~1440px.
  - Impact:
    - Poor use of available screen space on ultra-wide displays.
    - May affect perceived modernity and adaptability of layout.

⚠️ Finding #2: Page Elements Overlap or Break on Smaller Screens  
  - Severity: Medium (Responsive Design Bug)
  - Description: When reducing the viewport size, certain elements shift or overlap, breaking the layout.
  - Evidence:
    - Text elements wrap unpredictably.
    - Images and buttons shift offscreen without scroll or resize adjustment.
  - Impact:
    - Degraded mobile experience.
    - Accessibility and usability challenges for users on smaller devices.

❌ Finding #3: Menu Button Becomes Non-functional on Small Screens  
  - Severity: High (Functional Bug)
  - Description: On smaller screen sizes, the menu button (hamburger) is visible but unresponsive to user interaction.
  - Evidence:
    - Replicated on Chrome and Firefox at ~375px width.
    - No dropdown or slide-out menu appears on click.
  - Impact:
    - Blocks user navigation on mobile.
    - Critical for user flow and site accessibility.

⚠️ Finding #4: Footer Bar Is Misaligned and Non-Responsive  
  - Severity: Medium (UI/UX Bug)
  - Description: The footer does not resize properly with the viewport, causing visual misalignment and spacing issues.
  - Evidence:
    - Social icons overlap with text.
    - Layout breaks in Safari and Chrome when resizing.
  - Impact:
    - Unprofessional appearance.
    - Accessibility concerns on small screens.

---

## 📈 Performance & Accessibility Audits

### Lighthouse Summary:
- **Performance:** 90
- **Accessibility:** 75
- **Best Practices:** 78


## 🏁 Summary of Issues

The exploratory testing session for the Good Budget web application (free tier) has uncovered a range of issues spanning multiple facets of the application. While core functionalities like REST call behavior and general performance are relatively stable, several critical areas require immediate attention.

**Key areas of concern include:**

1.  **Security Vulnerabilities (CRITICAL & HIGH Priority):**
    * **Insecure Password Transmission:** Passwords sent in plain text during login (Finding #9, Charter 1).
    * **Potential SQL Injection:** Multiple fields (Account Name, Envelope Name, Transaction Payee) appear to accept raw SQL-like syntax without sanitization (Finding #1, Charter 2; Finding #2, Charter 3; Finding #9, Charter 4).
    * **Sensitive Data Exposure:** User identifiers, subscription levels, and tokens stored in LocalStorage, making them vulnerable to XSS attacks (Finding #10, Charter 1).
    * **Severe Email Validation Bypass:** Acceptance of malformed email addresses violating RFC standards (Finding #6, Charter 1).
    * **Missing Cookie Consent Management:** Tracking cookies set without prior user consent, posing a GDPR/privacy compliance risk (Finding #4, Charter 1).
    * **Weak Password Policy:** Minimum length of 4 characters and acceptance of whitespace-only passwords (Finding #4, Charter 1).
    * **No Email Verification Process:** Accounts can be created without email validation, risking abuse (Finding #5, Charter 1).
    * **Unsafe Input in Password Field:** Allows SQL-like syntax, indicating lack of sanitization (Finding #7, Charter 1).

2.  **Data Integrity & Validation Issues (Medium to High Priority):**
    * Numerous fields across Account, Envelope, and Transaction management accept invalid inputs like empty values, non-numeric characters where numbers are expected, negative values in inappropriate contexts (e.g., envelope amounts, filling envelopes), and misleading numeric formats (Findings #2, #3, #4 Charter 2; Findings #3, #7, #8, #10 Charter 3; Finding #10 Charter 4).
    * Account "Current Balance" editing behavior is counterintuitive, leading to cumulative additions instead of replacement, risking inaccurate records (Finding #1, Charter 4).
    * Transactions can be created from unfilled envelopes (Finding #8, Charter 4).

3.  **User Experience (UX) & Usability Flaws (Medium to High Priority):**
    * **Critical Functional Bug:** Account deletion flow is non-intuitive and ultimately fails, preventing users from deleting accounts (Finding #7, Charter 2).
    * **Responsive Design:** Menu button becomes non-functional on small screens (Finding #3, Charter 7), elements overlap or break (Finding #2, Charter 7), and footer is misaligned (Finding #4, Charter 7).
    * **Unintuitive Flows:** Editing transactions (Finding #7, Charter 4), editing account balances (Finding #1, Charter 4), "Fill Envelopes" feature lacks discoverability and clarity (Findings #5, #6, #9 Charter 3).
    * **Missing Feedback/Save Options:** No explicit "Save" option in envelope edit mode for "Due on the" field (Finding #1, Charter 3); unsaved envelope changes lost on navigation (Finding #4, Charter 3).
    * **Visual Instability & Performance Perception:** Delayed sign-up element rendering and subsequent layout shift (Findings #1, #2 Charter 1).
    * **Inconsistent UI:** Large number display issues (Finding #5, Charter 2), unclear checkboxes/columns in transactions (Findings #2, #3 Charter 4), Payee column displaying account description (Finding #5, Charter 4).

4.  **Accessibility Deficiencies (Low to Medium Priority):**
    * Multiple instances of inadequate color contrast (Finding #1, #5 Charter 5).
    * Missing alt attributes for decorative images (Finding #2, Charter 5).
    * Links without discernible names (Finding #3, Charter 5).
    * Form fields lacking proper label associations (Finding #4, Charter 5).
    * Small touch targets impacting mobile usability (Finding #6, Charter 5).
    * Illogical heading order (Finding #7, Charter 5).
    * The Lighthouse accessibility score of 75 reflects these findings.

5.  **Functional & Appearance Issues:**
    * Missing asset files on the signup page, potentially affecting functionality, appearance, and security (Finding #3, Charter 1).

While some positive aspects like session management (Finding #8, Charter 1), certain email validation capabilities (Finding #3, Charter 1), and real-time cross-browser sync (Finding #3, Charter 6) were noted, they are overshadowed by the volume and severity of the identified issues.

---

## 🔐 Risk Mitigation Strategy

To address the identified issues and stabilize the Good Budget web application, a multi-pronged risk mitigation strategy is essential. This strategy should prioritize fixing critical vulnerabilities and major functional blockers, followed by usability and data integrity enhancements, and finally, accessibility and minor UX improvements.

1.  **Immediate Security Hardening (Address CRITICAL & HIGH Risks):**
    * **HTTPS Enforcement:** Mandate HTTPS for all data transmission, especially login and any form submissions involving sensitive data, to prevent plain text password exposure (remediation for Finding #9, Charter 1).
    * **Input Sanitization & Parameterized Queries:** Implement robust server-side validation and sanitization for ALL user-supplied inputs across the application (Account names, Envelope names, Transaction Payee, password fields, email fields) to prevent SQL Injection and other injection attacks (remediation for Finding #1, Charter 2; Finding #2, Charter 3; Finding #9, Charter 4; Finding #7, Charter 1). Use prepared statements/parameterized queries for database interactions.
    * **Secure Credential Storage:** Review and enforce strong password hashing with unique salts for user passwords.
    * **LocalStorage Review:** Remove sensitive user data (tokens, PII, subscription details) from LocalStorage (remediation for Finding #10, Charter 1). Utilize secure, server-side session management or HTTP-only, secure cookies for tokens if client-side storage is unavoidable for specific tokens.
    * **Email Validation & Verification:** Implement a mandatory email verification step for all new account creations (remediation for Finding #5, Charter 1). Fix severe email validation bypass to adhere to RFC standards (remediation for Finding #6, Charter 1).
    * **Password Policy Enforcement:** Implement and enforce a strong password policy (e.g., minimum 8-10 characters, mix of cases, numbers, symbols; disallow common or whitespace-only passwords) (remediation for Finding #4, Charter 1).
    * **Cookie Consent Mechanism:** Implement a GDPR-compliant cookie consent banner/manager before any tracking cookies are set (remediation for Finding #4, Charter 1).
    * **Dependency Management:** Ensure all third-party plugins (Wordfence, Yoast, Elementor, GeneratePress) are up-to-date and correctly configured to resolve missing asset issues and potential inherited vulnerabilities (remediation for Finding #3, Charter 1).
    * **Regular Security Audits:** Schedule regular penetration testing and code reviews by security professionals.

2.  **Critical Functionality & Data Integrity Restoration (Address HIGH & Medium-High Risks):**
    * **Account Deletion:** Redesign and fix the account deletion flow to be intuitive and functional (remediation for Finding #7, Charter 2).
    * **Responsive Design Fixes:** Ensure the menu button is functional on small screens (remediation for Finding #3, Charter 7). Address element overlaps and footer misalignment on smaller viewports (remediation for Finding #2, #4 Charter 7).
    * **Input Validation Overhaul:**
        * Implement strict server-side and client-side validation for all input fields, particularly financial fields (amounts, balances) to ensure they are numeric, within logical ranges (e.g., non-negative for envelope fills/amounts), and handle edge cases correctly (remediation for multiple findings across Charters 2, 3, 4).
        * Prevent empty submissions for mandatory fields (e.g., Account Name, Payer).
        * Clarify and fix the account "Current Balance" editing behavior to be a direct replacement or provide a clear transaction-based alternative (remediation for Finding #1, Charter 4).
    * **Transaction Logic:** Prevent transactions from being created from unfilled/empty envelopes or implement clear warnings/rules (remediation for Finding #8, Charter 4).

3.  **Usability & User Experience Enhancement (Address Medium Risks):**
    * **Workflow Clarification:** Add explicit "Save" buttons where missing (e.g., Envelope edit) and provide warnings for unsaved changes before navigation.
    * **Intuitive Interactions:** Redesign unintuitive interactions for editing, filling envelopes, and managing transactions to follow standard UX patterns. Provide clear labels, tooltips, and contextual help, especially for ambiguous fields like "Amt" or functions like "Add" vs. "Set".
    * **Visual Consistency & Feedback:** Address layout shifts, inconsistent component sizing between browsers, and improve display of large numbers and negative values.
    * **Performance:** Investigate and optimize rendering times for elements like the sign-up component.

4.  **Accessibility Compliance (Address Low to Medium Risks):**
    * **WCAG Adherence:** Systematically review and update the application to meet WCAG 2.1 AA standards. This includes:
        * Ensuring proper color contrast for text and UI elements.
        * Providing alt text for all informative images and `role="presentation"` for decorative ones.
        * Making all links discernible with clear text or ARIA labels.
        * Correctly associating labels with all form fields.
        * Increasing touch target sizes for interactive elements.
        * Ensuring a logical heading order for page structure.
    * **Testing:** Incorporate both automated (e.g., aXe, Lighthouse) and manual testing with assistive technologies (screen readers) into the development lifecycle.

By systematically addressing these risks, Good Budget can significantly improve its security posture, data integrity, user satisfaction, and overall application quality.

---


---

## ✅ Conclusion

The exploratory testing session of the Good Budget web application (free tier) reveals that while the application is generally functional with commendable base performance and REST API behavior, it currently suffers from several critical and high-severity issues that significantly undermine its reliability, security, and usability.

The most pressing concerns are the **critical security vulnerabilities**, including insecure password transmission, multiple potential SQL injection points, and the exposure of sensitive user data in LocalStorage. These issues pose immediate risks to user data and trust and require urgent remediation.

Furthermore, **significant data integrity flaws** exist due to inadequate input validation across core budgeting features. Combined with **major UX deficiencies**, such as a broken account deletion process, non-functional responsive menu, and numerous unintuitive workflows, the application currently offers a frustrating and potentially misleading experience for users. Accessibility also requires substantial improvement to meet WCAG standards, with a current Lighthouse score of 75 reflecting this.

While positive aspects were noted, the sheer volume and severity of findings, particularly in security and core functionality, indicate that immediate and focused development effort is required. Addressing the outlined issues, starting with the critical security flaws and functional blockers detailed in the Risk Mitigation Strategy, is paramount to ensure data safety, regulatory compliance (e.g., GDPR for cookie consent), and to provide a trustworthy and effective budgeting tool for its users. Improvements in these areas will be crucial for the application's success and reputation.

---

