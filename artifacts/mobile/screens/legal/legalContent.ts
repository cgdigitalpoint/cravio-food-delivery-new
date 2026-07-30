// ─── Legal Document Content ────────────────────────────────────────────────────
// Original professional content for all Cravio legal policies.
// Each doc has structured sections rendered by LegalDocScreen.

export interface LegalSection {
  heading: string;
  paragraphs: string[];
}

export interface LegalDoc {
  id: string;
  title: string;
  emoji: string;
  lastUpdated: string;
  effectiveDate: string;
  intro: string;
  sections: LegalSection[];
}

// ─── Privacy Policy ───────────────────────────────────────────────────────────

const privacyPolicy: LegalDoc = {
  id: 'privacy-policy',
  title: 'Privacy Policy',
  emoji: '🔒',
  lastUpdated: 'July 1, 2026',
  effectiveDate: 'July 1, 2026',
  intro:
    'At Cravio, your privacy is fundamental to everything we build. This Privacy Policy explains what information we collect, how we use it, and the choices you have.',
  sections: [
    {
      heading: '1. Introduction',
      paragraphs: [
        'Cravio Food Delivery ("Cravio", "we", "our", or "us") is operated by CG Digital Point. We are committed to protecting the personal information of every user ("you") who accesses or uses the Cravio mobile application.',
        'By creating an account or using our services, you acknowledge that you have read, understood, and agree to the practices described in this Privacy Policy.',
      ],
    },
    {
      heading: '2. Definitions',
      paragraphs: [
        '"Personal Information" means any data that can identify you directly or indirectly, including but not limited to your name, email address, phone number, and payment details.',
        '"Device Information" means technical data collected from your mobile device such as device model, operating system version, unique device identifiers, and IP address.',
        '"Usage Data" means information about how you interact with the app — pages visited, features used, time spent, and actions taken.',
      ],
    },
    {
      heading: '3. Information We Collect',
      paragraphs: [
        'Personal Information: When you register, we collect your name, email address, phone number, and profile photo (optional). When you place orders, we collect your delivery addresses and order history.',
        'Device Information: We automatically collect your device model, operating system, app version, and unique identifiers (such as device ID or advertising ID) to improve app performance and security.',
        'Location Information: With your permission, we collect precise GPS location to show nearby restaurants, estimate delivery times, and assign delivery partners. You may disable location access in your device settings, though this will limit functionality.',
        'Payment Information: Payment transactions are processed by certified third-party payment gateways. Cravio does not store your full card numbers, UPI credentials, or banking passwords. We only retain transaction references and payment status.',
        'Saved Addresses: Delivery addresses you save are stored securely to make future ordering faster and more convenient.',
        'Restaurant Preferences: We record your saved restaurants, cuisine preferences, dietary settings (such as veg mode), and order history to personalise your experience.',
      ],
    },
    {
      heading: '4. Device Permissions',
      paragraphs: [
        'Camera Permission: Used only when you choose to upload or update your profile photo. We do not access your camera without an explicit action from you.',
        'Storage Permission: Required to save photos to your device gallery when you upload a profile picture. We do not read or modify other files on your device.',
        'Notification Permission: Used to send you order updates, promotional offers, and important account alerts. You can manage notification preferences in your device settings at any time.',
        'Location Permission: Required to show nearby restaurants and provide accurate delivery tracking. You can revoke location access at any time, but this may prevent certain features from working.',
      ],
    },
    {
      heading: '5. How We Use Your Information',
      paragraphs: [
        'Order Processing: We use your personal and payment information to receive, process, and confirm your food orders and facilitate delivery to your location.',
        'Delivery Tracking: Your real-time location and address data are shared with assigned delivery partners solely to complete your delivery.',
        'Customer Support: We use your account information and order history to assist you when you contact our support team.',
        'Marketing Communications: With your consent, we send personalised offers, new restaurant announcements, and promotional content. You may opt out at any time via app settings or unsubscribing from emails.',
        'Analytics: We analyse aggregated, anonymised usage data to improve app performance, fix bugs, and develop new features.',
        'Cookies & Local Storage: We use local storage on your device to keep you logged in and remember your preferences between sessions.',
      ],
    },
    {
      heading: '6. Data Security',
      paragraphs: [
        'Encryption: All data transmitted between your device and our servers is encrypted using TLS 1.2 or higher. Sensitive data at rest is encrypted using AES-256.',
        'Access Controls: Access to user data is restricted to authorised employees and contractors on a need-to-know basis. All personnel with data access are bound by confidentiality obligations.',
        'Data Retention: We retain your account data for as long as your account is active or as needed to provide services. Order history is retained for up to seven years for legal and tax compliance. After account deletion, personal data is removed within 30 days unless longer retention is legally required.',
      ],
    },
    {
      heading: '7. Third-Party Services',
      paragraphs: [
        'Firebase (Google): Used for push notifications and app analytics. Firebase may collect device and usage data subject to Google\'s Privacy Policy.',
        'Supabase: Our backend database provider. User data is stored in Supabase\'s secure cloud infrastructure. Supabase processes data in accordance with GDPR and SOC 2 standards.',
        'Google Maps: Used to display restaurant locations, delivery maps, and address auto-completion. Your location data may be transmitted to Google subject to their Privacy Policy.',
        'Payment Gateways: We integrate with certified payment providers to process UPI, card, and wallet payments. These providers operate under their own privacy policies and PCI DSS compliance frameworks.',
        'We do not sell your personal information to any third party. Third-party services are only provided with the minimum data necessary to perform their function.',
      ],
    },
    {
      heading: '8. Your Rights',
      paragraphs: [
        'Download Personal Data: You may request a copy of your personal data by contacting us at privacy@cravioapp.in.',
        'Update Personal Data: You can update your name, phone number, email, and profile photo at any time through the Edit Profile screen.',
        'Delete Personal Data: You may request deletion of your personal data. Upon verified request, we will delete your data within 30 days subject to legal retention obligations.',
        'Delete Account: You can initiate account deletion directly from the app via Profile → Delete Account. This action is irreversible and will permanently remove your account and associated data.',
      ],
    },
    {
      heading: "9. Children's Privacy",
      paragraphs: [
        'Cravio is not intended for use by individuals under the age of 18. We do not knowingly collect personal information from minors. If we discover that a user is under 18, we will promptly delete their account and associated data.',
        'If you believe a minor has created an account, please contact us immediately at privacy@cravioapp.in.',
      ],
    },
    {
      heading: '10. Legal Compliance',
      paragraphs: [
        'We comply with applicable data protection laws including the Information Technology Act, 2000 (India) and the Digital Personal Data Protection Act, 2023. We may disclose your information if required to do so by law, court order, or governmental authority.',
      ],
    },
    {
      heading: '11. Changes to This Policy',
      paragraphs: [
        'We may update this Privacy Policy periodically to reflect changes in our practices or applicable law. When we make material changes, we will notify you through the app and update the "Last Updated" date above.',
        'Continued use of Cravio after changes take effect constitutes your acceptance of the revised policy.',
      ],
    },
    {
      heading: '12. Contact Us',
      paragraphs: [
        'For privacy-related questions, data requests, or concerns, please contact:',
        'CG Digital Point\nEmail: privacy@cravioapp.in\nAddress: India\nWebsite: www.cravioapp.in',
      ],
    },
  ],
};

// ─── Terms & Conditions ───────────────────────────────────────────────────────

const termsAndConditions: LegalDoc = {
  id: 'terms',
  title: 'Terms & Conditions',
  emoji: '📋',
  lastUpdated: 'July 1, 2026',
  effectiveDate: 'July 1, 2026',
  intro:
    'These Terms & Conditions govern your use of the Cravio Food Delivery application. Please read them carefully before using our services.',
  sections: [
    {
      heading: '1. Acceptance of Terms',
      paragraphs: [
        'By downloading, installing, or using the Cravio application, you agree to be bound by these Terms & Conditions and our Privacy Policy. If you do not agree, please do not use Cravio.',
        'These Terms constitute a legally binding agreement between you and CG Digital Point ("Company"), the developer and operator of Cravio.',
      ],
    },
    {
      heading: '2. Eligibility',
      paragraphs: [
        'You must be at least 18 years of age to create an account and use Cravio. By registering, you represent and warrant that you meet this requirement.',
        'Cravio is currently available for use within India. Access from outside India may be restricted or unsupported.',
      ],
    },
    {
      heading: '3. User Accounts',
      paragraphs: [
        'You are required to provide accurate, current, and complete information when creating your account. You agree to update your information promptly if it changes.',
        'Account Security: You are responsible for maintaining the confidentiality of your login credentials. You must notify us immediately at support@cravioapp.in if you suspect any unauthorised access to your account.',
        'Each user may maintain only one active account. Creating multiple accounts to abuse promotions or evade suspensions is prohibited.',
      ],
    },
    {
      heading: '4. Restaurant Listings & Menu',
      paragraphs: [
        'Cravio displays restaurant listings and menus provided by partner restaurants. We act as an intermediary platform and are not responsible for the accuracy of menu descriptions, ingredient information, or allergen details published by restaurants.',
        'Menu Accuracy: Prices, item availability, and preparation times are managed by the respective restaurants and may change without prior notice. Images are for illustrative purposes only.',
        'Pricing: All prices listed in the app are in Indian Rupees (INR) and are inclusive of applicable taxes unless stated otherwise.',
        'Taxes: GST and other applicable taxes are applied based on item type and restaurant location as per Indian tax regulations.',
      ],
    },
    {
      heading: '5. Payments',
      paragraphs: [
        'UPI: You may pay via UPI apps (GPay, PhonePe, Paytm, etc.). UPI transactions are processed by certified payment partners.',
        'Cards: Debit and credit card payments are processed securely by our payment gateway partner. Cravio does not store your full card number.',
        'Wallet: You may use your Cravio Wallet balance (if applicable) to pay for orders.',
        'Cash on Delivery (COD): COD is available at select restaurants. The exact amount must be paid to the delivery partner at the time of delivery. No change is guaranteed.',
        'Failed Payments: If a payment fails after an order is confirmed, the order may be automatically cancelled. Any deducted amount will be refunded to your original payment method within 5–7 business days.',
      ],
    },
    {
      heading: '6. Orders & Cancellations',
      paragraphs: [
        'Once an order is placed and accepted by a restaurant, cancellation may not be possible. You may cancel an order within 60 seconds of placing it if the restaurant has not yet accepted it.',
        'Cravio reserves the right to cancel orders in cases of restaurant unavailability, payment failure, fraud detection, or force majeure events.',
        'For cancellations eligible for a refund, amounts will be credited to your original payment method within 5–7 business days.',
      ],
    },
    {
      heading: '7. Refund Policy',
      paragraphs: [
        'Refunds are considered in cases of incorrect or missing items, poor food quality (with valid evidence), significantly delayed delivery, or duplicate charges.',
        'Refund requests must be submitted within 24 hours of order delivery via the Help Centre in the app.',
        'Approved refunds are processed within 5–7 business days for card/UPI payments. Wallet refunds are typically processed within 24 hours.',
        'Promotional credits and cashback amounts are non-refundable unless required by applicable law.',
      ],
    },
    {
      heading: '8. Delivery',
      paragraphs: [
        'Delivery Charges: Delivery fees are calculated based on distance, order value, and current demand. Fees are displayed at checkout before payment.',
        'Estimated Delivery Time: Delivery time estimates are provided in good faith but are not guaranteed. Actual delivery may vary due to traffic, weather, restaurant preparation time, and other factors.',
        'Delays: Cravio is not liable for delivery delays caused by force majeure events, incorrect address information provided by the customer, or circumstances beyond our reasonable control.',
      ],
    },
    {
      heading: '9. Responsibilities',
      paragraphs: [
        'Customer Responsibilities: You are responsible for providing accurate delivery addresses, being available to receive your order, and making correct payments. Cravio is not responsible for orders delivered to incorrect addresses provided by you.',
        'Restaurant Responsibilities: Partner restaurants are responsible for food quality, hygiene, packaging, and preparation accuracy. They must comply with applicable FSSAI regulations.',
        'Platform Responsibilities: Cravio is responsible for providing a functional ordering platform, facilitating payments, and coordinating delivery logistics. We are not a food manufacturer or restaurant and are not liable for food quality issues.',
      ],
    },
    {
      heading: '10. Donation Terms',
      paragraphs: [
        'Cravio offers an optional donation feature at checkout. Donations are completely voluntary — you are never required to donate to place an order.',
        'Donation amounts are displayed separately from your food order total and processed independently.',
        'Donations are generally non-refundable unless required by applicable law. The purpose and beneficiary of donations are always disclosed at the point of contribution.',
      ],
    },
    {
      heading: '11. Fraud Prevention',
      paragraphs: [
        'Fake Orders: Placing orders with no intention of payment, repeatedly cancelling orders, or providing false delivery addresses is strictly prohibited and may result in immediate account suspension.',
        'Fake Reviews: Submitting false, misleading, or incentivised reviews is prohibited. We reserve the right to remove such reviews and suspend accounts engaging in review manipulation.',
      ],
    },
    {
      heading: '12. Intellectual Property',
      paragraphs: [
        'Copyright: All content in the Cravio application, including but not limited to the logo, design, text, graphics, and software, is owned by CG Digital Point and protected under Indian copyright law.',
        'Trademark: "Cravio" and the Cravio logo are trademarks of CG Digital Point. You may not use our trademarks without prior written consent.',
        'You are granted a limited, non-exclusive, non-transferable licence to use the Cravio app for personal, non-commercial purposes only.',
      ],
    },
    {
      heading: '13. Limitation of Liability',
      paragraphs: [
        'To the maximum extent permitted by law, Cravio and CG Digital Point shall not be liable for indirect, incidental, special, or consequential damages arising from your use of the platform.',
        'Our total liability for any claim arising out of or relating to these Terms shall not exceed the amount you paid to Cravio in the 30 days preceding the incident.',
      ],
    },
    {
      heading: '14. Force Majeure',
      paragraphs: [
        'Cravio shall not be held liable for failure to perform obligations due to circumstances beyond our reasonable control, including natural disasters, government actions, power outages, internet disruptions, or pandemics.',
      ],
    },
    {
      heading: '15. Suspension & Termination',
      paragraphs: [
        'We reserve the right to suspend or terminate your account immediately if you violate these Terms, engage in fraudulent activity, abuse our support team, or misuse the platform in any way.',
        'You may delete your account at any time through the Delete Account option in the app.',
      ],
    },
    {
      heading: '16. Governing Law',
      paragraphs: [
        'These Terms are governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts located in India.',
      ],
    },
    {
      heading: '17. Changes to Terms',
      paragraphs: [
        'We may update these Terms periodically. Material changes will be communicated via in-app notification. Continued use of Cravio after changes take effect constitutes acceptance of the revised Terms.',
      ],
    },
    {
      heading: '18. Contact',
      paragraphs: [
        'CG Digital Point\nEmail: legal@cravioapp.in\nWebsite: www.cravioapp.in',
      ],
    },
  ],
};

// ─── Refund & Cancellation Policy ─────────────────────────────────────────────

const refundPolicy: LegalDoc = {
  id: 'refund-policy',
  title: 'Refund & Cancellation Policy',
  emoji: '↩️',
  lastUpdated: 'July 1, 2026',
  effectiveDate: 'July 1, 2026',
  intro:
    'We want every Cravio experience to be satisfying. This policy explains when and how refunds and cancellations are handled.',
  sections: [
    {
      heading: '1. Order Cancellations by Customer',
      paragraphs: [
        'You may cancel an order within 60 seconds of placing it, provided the restaurant has not yet accepted the order. After this window, cancellations may not be possible.',
        'To request a cancellation, go to Orders → Select Order → Request Cancellation. If the option is unavailable, the order is already in preparation and cancellation is not possible.',
        'If a cancellation is approved, any paid amount will be refunded to your original payment method within 5–7 business days.',
      ],
    },
    {
      heading: '2. Cancellations by Cravio or Restaurant',
      paragraphs: [
        'Cravio or the restaurant may cancel an order due to restaurant closure, item unavailability, technical payment issues, or suspicion of fraudulent activity.',
        'In such cases, you will receive a full refund to your original payment method. You will be notified promptly via push notification and email.',
      ],
    },
    {
      heading: '3. Eligible Refund Scenarios',
      paragraphs: [
        'Missing Items: If one or more items from your order were not delivered, you are eligible for a partial refund covering the value of the missing items.',
        'Wrong Items Delivered: If items delivered do not match your order, you are eligible for a full or partial refund depending on the extent of the discrepancy.',
        'Significantly Delayed Delivery: If your order is delayed beyond the maximum estimated delivery time (as displayed at checkout) due to reasons within our control, you may be eligible for a partial refund or credit.',
        'Food Quality Issues: If the delivered food is spoiled, unsafe to consume, or significantly misrepresented, you may request a refund with photographic evidence within 2 hours of delivery.',
        'Duplicate Charges: If you were charged twice for the same order, the duplicate charge will be refunded within 2–3 business days upon verification.',
      ],
    },
    {
      heading: '4. Non-Refundable Scenarios',
      paragraphs: [
        'Correct orders delivered to the correct address, where you simply changed your mind.',
        'Orders where you provided an incorrect delivery address.',
        'Refund requests submitted more than 24 hours after delivery.',
        'Promotional discounts, cashback credits, and referral rewards.',
        'Delivery charges in cases where the food was correctly delivered.',
        'Voluntary donations made at checkout.',
      ],
    },
    {
      heading: '5. How to Request a Refund',
      paragraphs: [
        'Open the Cravio app and go to Orders.',
        'Select the relevant order and tap "Help with this order".',
        'Choose the issue type and provide a description. Attach photos if applicable.',
        'Submit your request. Our team will review and respond within 24 hours.',
      ],
    },
    {
      heading: '6. Refund Processing Time',
      paragraphs: [
        'UPI / Bank Transfer: 5–7 business days after approval.',
        'Credit / Debit Cards: 5–7 business days after approval, depending on your bank.',
        'Cravio Wallet: Within 24 hours of approval.',
        'COD Orders: Refunds for COD orders are credited to your Cravio Wallet within 24 hours of approval.',
      ],
    },
    {
      heading: '7. Disputes',
      paragraphs: [
        'If you disagree with our refund decision, you may escalate by emailing support@cravioapp.in with your order ID and a description of your concern. Our senior support team will review escalations within 48 hours.',
      ],
    },
  ],
};

// ─── Shipping & Delivery Policy ───────────────────────────────────────────────

const shippingPolicy: LegalDoc = {
  id: 'shipping-policy',
  title: 'Shipping & Delivery Policy',
  emoji: '🚚',
  lastUpdated: 'July 1, 2026',
  effectiveDate: 'July 1, 2026',
  intro:
    'Cravio connects you with delivery partners to bring food from partner restaurants to your door. Here is everything you need to know about our delivery service.',
  sections: [
    {
      heading: '1. Delivery Coverage',
      paragraphs: [
        'Cravio currently operates in select cities and localities across India. Restaurant availability and delivery zones are displayed based on your live location.',
        'Delivery availability may vary by time of day. If no restaurants are available in your area, the app will show a "No restaurants found" screen.',
      ],
    },
    {
      heading: '2. Delivery Partners',
      paragraphs: [
        'Deliveries are fulfilled by independent delivery partners assigned by Cravio. These partners are verified, trained, and equipped with insulated bags to maintain food temperature.',
        'Cravio delivery partners are identifiable by their Cravio-branded delivery bag and will match the name displayed on your order tracking screen.',
      ],
    },
    {
      heading: '3. Delivery Charges',
      paragraphs: [
        'Delivery fees are dynamically calculated based on the distance from the restaurant to your delivery address, current platform demand, and promotional waivers (if applicable).',
        'The exact delivery fee is displayed at checkout before you confirm your order. Delivery charges are non-refundable unless the order is cancelled by Cravio or the restaurant.',
        'Minimum order values may apply to certain restaurants. Any applicable minimum order requirement is shown on the restaurant page.',
      ],
    },
    {
      heading: '4. Estimated Delivery Time',
      paragraphs: [
        'Estimated delivery times are calculated based on restaurant preparation time, distance, traffic conditions, and current delivery partner availability.',
        'Estimated times are shown on the restaurant page and confirmed at checkout. These are good-faith estimates and not guaranteed delivery times.',
        'Real-time tracking is available in the Orders section once your order has been picked up by a delivery partner.',
      ],
    },
    {
      heading: '5. Delays',
      paragraphs: [
        'Delays may occur due to traffic congestion, adverse weather conditions, restaurant preparation delays, high order volume, or other circumstances outside our control.',
        'In the event of a significant delay (beyond the maximum estimated delivery window), you will be notified in-app. You may be eligible for a partial refund or Cravio credit as a goodwill gesture at our discretion.',
        'Cravio is not liable for delays caused by force majeure events, incorrect address information, or inaccessible delivery locations.',
      ],
    },
    {
      heading: '6. Contactless Delivery',
      paragraphs: [
        'Contactless delivery is available by default. Your delivery partner will leave your order at the door and notify you via the app when it has been dropped off.',
        'You can select or change your delivery preference in the checkout screen or in your profile settings.',
      ],
    },
    {
      heading: '7. Failed Delivery Attempts',
      paragraphs: [
        'If delivery cannot be completed due to an incorrect address, inaccessible location, or your unavailability, the delivery partner will make one contact attempt via the app.',
        'If the delivery cannot be completed, the order may be marked as undelivered. In such cases, a refund may not be applicable as the order was prepared and delivery was attempted.',
        'Please ensure your delivery address is accurate and you are available during the estimated delivery window.',
      ],
    },
    {
      heading: '8. Food Safety',
      paragraphs: [
        'All partner restaurants are responsible for ensuring their food meets FSSAI hygiene and safety standards before handoff to our delivery partners.',
        'Delivery partners use insulated bags to minimise temperature changes during transit. However, Cravio cannot guarantee food temperature upon delivery for longer distances or during extreme weather.',
      ],
    },
    {
      heading: '9. Contact',
      paragraphs: [
        'For delivery-related concerns, contact us via Help Centre in the app or email support@cravioapp.in.',
      ],
    },
  ],
};

// ─── Donation Policy ──────────────────────────────────────────────────────────

const donationPolicy: LegalDoc = {
  id: 'donation-policy',
  title: 'Donation Policy',
  emoji: '❤️',
  lastUpdated: 'July 1, 2026',
  effectiveDate: 'July 1, 2026',
  intro:
    'Cravio provides an optional donation feature to help users contribute to social causes. This policy explains how donations work and your rights as a donor.',
  sections: [
    {
      heading: '1. Voluntary Nature of Donations',
      paragraphs: [
        'Donations on Cravio are completely optional. You are never required to donate to place a food order, access any feature, or use any part of the application.',
        'The donation prompt at checkout is a feature for users who wish to contribute to social causes alongside their food orders. Declining to donate has absolutely no impact on your order, delivery, or account status.',
      ],
    },
    {
      heading: '2. Donation Display',
      paragraphs: [
        'Donation amounts are displayed separately from your food order total. You will always see a clear breakdown showing your food subtotal, delivery fee, taxes, and donation amount as distinct line items.',
        'The total amount charged to your payment method will clearly separate food order charges from any donation amount.',
      ],
    },
    {
      heading: '3. Donation Purpose & Beneficiary',
      paragraphs: [
        'The purpose of each donation campaign and the beneficiary organisation or cause is clearly disclosed at the point of donation, before you confirm your contribution.',
        'Cravio will not direct donations to any undisclosed cause. Campaign details, including the name of the beneficiary, are shown in the donation selection screen.',
        'Cravio may periodically change the active donation campaign. Each campaign change is communicated clearly within the app.',
      ],
    },
    {
      heading: '4. Donation Processing',
      paragraphs: [
        'Donation payments are processed through the same secure payment infrastructure used for food orders.',
        'Successful donations are confirmed with a receipt in your order confirmation and donation history screen.',
        'Cravio maintains an auditable record of all donations made through the platform.',
      ],
    },
    {
      heading: '5. Refund of Donations',
      paragraphs: [
        'Donations are generally non-refundable once processed, as funds are committed to the beneficiary cause.',
        'Exceptions may apply if required by applicable Indian law, in cases of payment errors resulting in duplicate charges, or where a donation campaign is found to be fraudulent or misrepresented.',
        'Refund requests for donations can be submitted to support@cravioapp.in within 24 hours of the transaction. Each request will be reviewed on a case-by-case basis.',
      ],
    },
    {
      heading: '6. Donation Receipts',
      paragraphs: [
        'A donation receipt is available within the app under Donation History. You may use this record for your personal financial records.',
        'Cravio does not provide tax exemption certificates for donations unless explicitly stated for a specific campaign.',
      ],
    },
    {
      heading: '7. Fraud Prevention',
      paragraphs: [
        'Any attempt to abuse the donation system — including but not limited to creating fake donations, exploiting donation-related promotions fraudulently, or misrepresenting donation activity — may result in immediate account suspension and legal action.',
      ],
    },
    {
      heading: '8. Changes to Donation Policy',
      paragraphs: [
        'Cravio reserves the right to modify this Donation Policy at any time. Material changes will be communicated via in-app notification.',
      ],
    },
    {
      heading: '9. Contact',
      paragraphs: [
        'For donation-related queries, contact: donations@cravioapp.in',
      ],
    },
  ],
};

// ─── Data Deletion Policy ─────────────────────────────────────────────────────

const dataDeletionPolicy: LegalDoc = {
  id: 'data-deletion',
  title: 'Data Deletion Policy',
  emoji: '🗑️',
  lastUpdated: 'July 1, 2026',
  effectiveDate: 'July 1, 2026',
  intro:
    'You have the right to delete your personal data. This policy explains exactly what happens when you request data deletion or delete your Cravio account.',
  sections: [
    {
      heading: '1. Your Right to Deletion',
      paragraphs: [
        'In accordance with the Digital Personal Data Protection Act, 2023 (India) and applicable data protection principles, you have the right to request deletion of your personal data held by Cravio.',
        'This right applies to personal information such as your name, email, phone number, profile photo, saved addresses, and device identifiers associated with your account.',
      ],
    },
    {
      heading: '2. How to Request Data Deletion',
      paragraphs: [
        'In-App Deletion: The fastest method is to use the Delete Account option in the app under Profile → Delete Account. This initiates immediate account deactivation.',
        'Email Request: You may submit a data deletion request by emailing privacy@cravioapp.in with the subject line "Data Deletion Request" and your registered email address or phone number for account verification.',
        'We will verify your identity before processing any deletion request to prevent unauthorised deletion of accounts.',
      ],
    },
    {
      heading: '3. What Gets Deleted',
      paragraphs: [
        'Upon verified deletion request, the following data is permanently removed within 30 days:',
        '• Your name, email address, and phone number\n• Profile photo and display name\n• Saved delivery addresses\n• Restaurant favourites and food preferences\n• App settings and personalisation data\n• Device tokens used for push notifications\n• Account credentials and authentication records',
      ],
    },
    {
      heading: '4. Data Retained After Deletion',
      paragraphs: [
        'Certain data may be retained beyond the 30-day deletion window for legal and compliance reasons:',
        '• Order transaction records and invoices: Retained for 7 years as required by Indian tax law (GST compliance).\n• Fraud investigation records: If your account was involved in a fraud investigation, relevant records may be retained for up to 5 years.\n• Anonymised analytics: Usage data stripped of all personal identifiers is retained indefinitely for platform improvement and cannot be linked back to you.\n• Legal holds: Data subject to a legal hold or court order will be retained until the hold is lifted.',
      ],
    },
    {
      heading: '5. Effect of Account Deletion',
      paragraphs: [
        'Account deletion is permanent and irreversible. Once deleted, your account cannot be recovered.',
        'You will lose access to your order history, saved addresses, favourites, Cravio credits, and wallet balance.',
        'Any pending orders will be cancelled and refunded if eligible before deletion completes.',
        'Cravio credits, wallet balance, and promotional rewards are forfeited upon account deletion and cannot be transferred.',
      ],
    },
    {
      heading: '6. Third-Party Data',
      paragraphs: [
        'Upon account deletion, we will request removal of your data from our primary third-party service providers (Supabase, Firebase). However, we cannot guarantee the deletion timeline of data held by independent third parties.',
        'Payment gateways retain transaction records independently in compliance with their own regulatory obligations.',
      ],
    },
    {
      heading: '7. Processing Time',
      paragraphs: [
        'Account deactivation begins immediately upon confirmation. Personal data deletion is completed within 30 days of your verified request.',
        'You will receive a confirmation email when your deletion request has been fully processed.',
      ],
    },
    {
      heading: '8. Contact',
      paragraphs: [
        'For data deletion requests or inquiries: privacy@cravioapp.in',
      ],
    },
  ],
};

// ─── Community Guidelines ─────────────────────────────────────────────────────

const communityGuidelines: LegalDoc = {
  id: 'community-guidelines',
  title: 'Community Guidelines',
  emoji: '🤝',
  lastUpdated: 'July 1, 2026',
  effectiveDate: 'July 1, 2026',
  intro:
    'Cravio is built on trust between customers, restaurants, and delivery partners. These guidelines help keep our community respectful, honest, and safe for everyone.',
  sections: [
    {
      heading: '1. Honest Reviews',
      paragraphs: [
        'Your reviews help other customers make informed decisions. We ask that all reviews be honest, based on your genuine experience, and submitted promptly after delivery.',
        'Do not submit reviews you did not personally experience. Fake, purchased, or incentivised reviews undermine the trust of the community and are not permitted.',
        'Reviews should be constructive. While negative feedback is welcome, abusive, threatening, or discriminatory language directed at restaurants or their staff is prohibited.',
      ],
    },
    {
      heading: '2. Respectful Communication',
      paragraphs: [
        'When interacting with Cravio customer support, restaurants, or delivery partners — through chat, reviews, or feedback — please be respectful.',
        'Harassment, threatening behaviour, abusive language, or discriminatory remarks based on race, religion, gender, caste, nationality, or any other characteristic are strictly prohibited and may result in permanent account suspension.',
      ],
    },
    {
      heading: '3. Honest Ordering',
      paragraphs: [
        'Place orders only when you genuinely intend to pay for and receive them. Repeatedly placing and cancelling orders, placing fraudulent orders, or providing false delivery addresses disrupts restaurants and delivery partners and is not permitted.',
        'If you encounter a genuine issue with your order, please use the in-app Help Centre to resolve it rather than disputing legitimate charges.',
      ],
    },
    {
      heading: '4. Accurate Account Information',
      paragraphs: [
        'Provide truthful information when creating your account, submitting support requests, or reporting issues. Misrepresenting your identity or order details to obtain refunds or promotions fraudulently is a violation of these guidelines.',
      ],
    },
    {
      heading: '5. Responsible Use of Promotions',
      paragraphs: [
        'Promotional offers and discount codes are intended for genuine customers. Creating multiple accounts, using invalid payment methods, or exploiting technical glitches to obtain promotions beyond their intended limits is prohibited.',
      ],
    },
    {
      heading: '6. Delivery Partner Respect',
      paragraphs: [
        'Our delivery partners work hard to bring your food to you. Please treat them with courtesy and respect. Abusive or threatening behaviour toward delivery partners will result in account suspension.',
        'Ensure your delivery address is accessible and you are available to receive your order within the estimated delivery window.',
      ],
    },
    {
      heading: '7. Content Standards',
      paragraphs: [
        'Any content you submit — including reviews, feedback, profile photos, or support messages — must not contain:',
        '• Hate speech, discrimination, or harassment\n• Threats of violence or harm\n• Sexually explicit material\n• Spam or irrelevant commercial content\n• Private information about other individuals\n• Defamatory or knowingly false statements',
      ],
    },
    {
      heading: '8. Reporting Violations',
      paragraphs: [
        'If you encounter content or behaviour that violates these guidelines, please report it through the Help Centre or email us at support@cravioapp.in. We investigate all reports and take appropriate action.',
      ],
    },
    {
      heading: '9. Enforcement',
      paragraphs: [
        'Violations of these Community Guidelines may result in content removal, warnings, temporary restrictions, or permanent account suspension depending on the severity and frequency of the violation.',
        'Cravio reserves the right to make enforcement decisions at its sole discretion. Persistent violators may be reported to relevant authorities.',
      ],
    },
  ],
};

// ─── Copyright & Trademark ────────────────────────────────────────────────────

const copyrightNotice: LegalDoc = {
  id: 'copyright',
  title: 'Copyright & Trademark',
  emoji: '©️',
  lastUpdated: 'July 1, 2026',
  effectiveDate: 'July 1, 2026',
  intro:
    'This notice describes the intellectual property rights associated with the Cravio brand and application.',
  sections: [
    {
      heading: '1. Copyright',
      paragraphs: [
        '© 2026 CG Digital Point. All rights reserved.',
        'The Cravio mobile application, including all source code, design assets, user interface elements, graphics, animations, icons, text, and documentation, is the exclusive property of CG Digital Point and is protected under the Copyright Act, 1957 (India) and applicable international copyright treaties.',
        'You may not reproduce, distribute, modify, create derivative works from, publicly display, or exploit any part of the Cravio application without explicit prior written permission from CG Digital Point.',
      ],
    },
    {
      heading: '2. Trademarks',
      paragraphs: [
        '"Cravio", the Cravio logo, the Cravio orange flame icon, and "Cravio Food Delivery" are trademarks and/or registered trademarks of CG Digital Point.',
        'These marks may not be used in connection with any product or service without the prior written consent of CG Digital Point, in any manner likely to cause confusion, or in any manner that disparages or discredits Cravio.',
        'All other trademarks, service marks, and logos used in the application are the property of their respective owners.',
      ],
    },
    {
      heading: '3. Permitted Use',
      paragraphs: [
        'You are granted a limited, personal, non-exclusive, non-transferable licence to use the Cravio application on your personal device solely for placing food orders and using the features provided by the application.',
        'This licence does not permit resale or commercial use, modification or adaptation of any portion of the app, extraction or reverse engineering of any source code, or creation of competing services based on our platform.',
      ],
    },
    {
      heading: '4. User-Generated Content',
      paragraphs: [
        'By submitting reviews, photos, or other content to Cravio, you grant CG Digital Point a worldwide, royalty-free, non-exclusive licence to use, reproduce, and display such content in connection with our services.',
        'You retain ownership of content you submit, but represent that you have the right to grant the above licence and that your content does not infringe any third-party intellectual property rights.',
      ],
    },
    {
      heading: '5. Reporting Infringement',
      paragraphs: [
        'If you believe any content on the Cravio platform infringes your intellectual property rights, please contact us at legal@cravioapp.in with a detailed description of the alleged infringement.',
      ],
    },
    {
      heading: '6. Contact',
      paragraphs: [
        'CG Digital Point\nEmail: legal@cravioapp.in\nWebsite: www.cravioapp.in',
      ],
    },
  ],
};

// ─── Open Source Licenses ─────────────────────────────────────────────────────

const openSourceLicenses: LegalDoc = {
  id: 'open-source-licenses',
  title: 'Open Source Licenses',
  emoji: '📦',
  lastUpdated: 'July 1, 2026',
  effectiveDate: 'July 1, 2026',
  intro:
    'Cravio is built with the help of open-source software. We are grateful to the open-source community. The following third-party libraries are used in this application.',
  sections: [
    {
      heading: 'React Native',
      paragraphs: [
        'Version: 0.79+\nLicense: MIT\nCopyright (c) Meta Platforms, Inc. and affiliates.',
        'Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files, to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software.',
      ],
    },
    {
      heading: 'Expo SDK',
      paragraphs: [
        'Version: ~54.0\nLicense: MIT\nCopyright (c) 2015-present 650 Industries, Inc. (aka Expo)',
        'Licensed under the MIT License. The Expo SDK provides the foundation for building universal React Native applications.',
      ],
    },
    {
      heading: 'Expo Router',
      paragraphs: [
        'Version: ~4.0\nLicense: MIT\nCopyright (c) 2022 650 Industries, Inc.',
        'File-based routing for React Native and web. Licensed under the MIT License.',
      ],
    },
    {
      heading: 'React Navigation',
      paragraphs: [
        'Version: ^6.0\nLicense: MIT\nCopyright (c) 2017 React Navigation Contributors',
        'Routing and navigation for React Native apps. Licensed under the MIT License.',
      ],
    },
    {
      heading: 'React Native Reanimated',
      paragraphs: [
        'Version: ~3.17\nLicense: MIT\nCopyright (c) 2016 Krzysztof Magiera',
        'A powerful animation library for React Native. Licensed under the MIT License.',
      ],
    },
    {
      heading: 'Zustand',
      paragraphs: [
        'Version: ^5.0\nLicense: MIT\nCopyright (c) 2019 Paul Henschel',
        'A small, fast state management library for React. Licensed under the MIT License.',
      ],
    },
    {
      heading: 'Lucide React Native',
      paragraphs: [
        'Version: ^0.475\nLicense: ISC\nCopyright (c) 2020 Lucide Contributors',
        'A beautiful icon library for React Native. Licensed under the ISC License.',
      ],
    },
    {
      heading: 'NativeWind',
      paragraphs: [
        'Version: ^4.1\nLicense: MIT\nCopyright (c) 2022 Mark Lawlor',
        'Tailwind CSS utility classes for React Native. Licensed under the MIT License.',
      ],
    },
    {
      heading: 'Supabase JS',
      paragraphs: [
        'Version: ^2.x\nLicense: MIT\nCopyright (c) 2020 Supabase',
        'Open-source Firebase alternative. JavaScript client library. Licensed under the MIT License.',
      ],
    },
    {
      heading: '@tanstack/react-query',
      paragraphs: [
        'Version: ^5.x\nLicense: MIT\nCopyright (c) 2021 Tanner Linsley',
        'Powerful asynchronous state management for React. Licensed under the MIT License.',
      ],
    },
    {
      heading: 'Expo Google Fonts (Inter & Poppins)',
      paragraphs: [
        'License: Open Font License (OFL)\nInter designed by Rasmus Andersson. Poppins designed by Indian Type Foundry and Jonny Pinhorn.',
        'Both typefaces are licensed under the SIL Open Font License, Version 1.1.',
      ],
    },
    {
      heading: 'React Native Safe Area Context',
      paragraphs: [
        'Version: 4.12+\nLicense: MIT\nCopyright (c) 2019 Th3rdwave',
        'A flexible way to handle safe areas in React Native. Licensed under the MIT License.',
      ],
    },
    {
      heading: 'Expo Linear Gradient',
      paragraphs: [
        'Version: ~14.0\nLicense: MIT\nCopyright (c) 2015-present 650 Industries, Inc.',
        'Provides a gradient view component for Expo apps. Licensed under the MIT License.',
      ],
    },
    {
      heading: 'React Native Gesture Handler',
      paragraphs: [
        'Version: ~2.22\nLicense: MIT\nCopyright (c) 2016 Krzysztof Magiera',
        'Native gesture management for React Native. Licensed under the MIT License.',
      ],
    },
    {
      heading: 'MIT License (Full Text)',
      paragraphs: [
        'Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:',
        'The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.',
        'THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.',
      ],
    },
  ],
};

// ─── All Docs Map ─────────────────────────────────────────────────────────────

export const LEGAL_DOCS: Record<string, LegalDoc> = {
  'privacy-policy': privacyPolicy,
  'terms': termsAndConditions,
  'refund-policy': refundPolicy,
  'shipping-policy': shippingPolicy,
  'donation-policy': donationPolicy,
  'data-deletion': dataDeletionPolicy,
  'community-guidelines': communityGuidelines,
  'copyright': copyrightNotice,
  'open-source-licenses': openSourceLicenses,
};

// ─── Legal Center Index ───────────────────────────────────────────────────────

export interface LegalEntry {
  id: string;
  title: string;
  emoji: string;
  subtitle: string;
}

export const LEGAL_CENTER_ENTRIES: LegalEntry[] = [
  { id: 'privacy-policy', title: 'Privacy Policy', emoji: '🔒', subtitle: 'How we collect and use your data' },
  { id: 'terms', title: 'Terms & Conditions', emoji: '📋', subtitle: 'Rules governing use of Cravio' },
  { id: 'refund-policy', title: 'Refund & Cancellation', emoji: '↩️', subtitle: 'Refunds, cancellations and returns' },
  { id: 'shipping-policy', title: 'Shipping & Delivery', emoji: '🚚', subtitle: 'How your orders are delivered' },
  { id: 'donation-policy', title: 'Donation Policy', emoji: '❤️', subtitle: 'Voluntary donations and your rights' },
  { id: 'data-deletion', title: 'Data Deletion Policy', emoji: '🗑️', subtitle: 'How to delete your data and account' },
  { id: 'community-guidelines', title: 'Community Guidelines', emoji: '🤝', subtitle: 'Standards for our community' },
  { id: 'copyright', title: 'Copyright & Trademark', emoji: '©️', subtitle: 'Intellectual property information' },
  { id: 'open-source-licenses', title: 'Open Source Licenses', emoji: '📦', subtitle: 'Third-party software we use' },
];
