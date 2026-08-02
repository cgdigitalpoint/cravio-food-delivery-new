// ─── Customer Support — Static Data ──────────────────────────────────────────

// ─── FAQ ─────────────────────────────────────────────────────────────────────

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface FAQCategory {
  id: string;
  label: string;
  emoji: string;
  items: FAQItem[];
}

export const FAQ_CATEGORIES: FAQCategory[] = [
  {
    id: 'orders',
    label: 'Orders',
    emoji: '📦',
    items: [
      {
        id: 'o1',
        question: 'How do I track my order?',
        answer:
          'Go to Orders in your profile, then tap the active order to open the live tracking map. The map updates in real-time and shows the estimated delivery time.',
      },
      {
        id: 'o2',
        question: 'Can I cancel my order?',
        answer:
          'You can cancel an order within 2 minutes of placing it, before the restaurant accepts it. Open the order details and tap "Cancel Order". After acceptance, cancellations must be requested through support.',
      },
      {
        id: 'o3',
        question: 'What if an item is missing from my order?',
        answer:
          'If an item is missing, raise a support ticket within 24 hours of delivery. Our team will review and issue a refund or replacement within 2 business days.',
      },
      {
        id: 'o4',
        question: 'Why is my order taking longer than expected?',
        answer:
          'Delays can happen due to high demand, weather conditions, or traffic. The app will show the latest estimated time. If the delay exceeds 45 minutes, you can contact support for assistance.',
      },
    ],
  },
  {
    id: 'payments',
    label: 'Payments',
    emoji: '💳',
    items: [
      {
        id: 'p1',
        question: 'What payment methods are accepted?',
        answer:
          'Cravio accepts UPI, credit/debit cards, net banking, and Cravio Wallet. Cash on delivery is available at select restaurants.',
      },
      {
        id: 'p2',
        question: 'How long does a refund take?',
        answer:
          'Refunds are processed within 5–7 business days to your original payment method. Wallet refunds are instant.',
      },
      {
        id: 'p3',
        question: 'Why was my payment declined?',
        answer:
          'Payment failures can occur due to insufficient funds, bank server issues, or incorrect card details. Try a different payment method or contact your bank.',
      },
    ],
  },
  {
    id: 'delivery',
    label: 'Delivery',
    emoji: '🚴',
    items: [
      {
        id: 'd1',
        question: 'What is the delivery fee?',
        answer:
          'Delivery fee varies by restaurant and distance, starting from ₹0. Orders above ₹499 from participating restaurants get free delivery.',
      },
      {
        id: 'd2',
        question: 'What areas do you deliver to?',
        answer:
          'Cravio delivers within a 15 km radius of partnered restaurants. Enter your address on the home screen to see available restaurants in your area.',
      },
      {
        id: 'd3',
        question: 'Can I change my delivery address after placing the order?',
        answer:
          'Address changes are not possible after the order is confirmed. Please ensure your address is correct before placing an order.',
      },
    ],
  },
  {
    id: 'account',
    label: 'Account',
    emoji: '👤',
    items: [
      {
        id: 'a1',
        question: 'How do I change my password?',
        answer:
          'Go to Profile → Change Password. Enter your current password and set a new one. Passwords must be at least 8 characters.',
      },
      {
        id: 'a2',
        question: 'How do I delete my account?',
        answer:
          'Go to Profile → Delete Account. This action is permanent and will remove all your data. You will receive a confirmation email before final deletion.',
      },
      {
        id: 'a3',
        question: 'Can I have multiple addresses?',
        answer:
          'Yes, you can save multiple addresses under Profile → Address Book. Set your preferred address as default for faster checkout.',
      },
    ],
  },
  {
    id: 'coupons',
    label: 'Coupons',
    emoji: '🎟️',
    items: [
      {
        id: 'c1',
        question: 'How do I apply a coupon?',
        answer:
          'At checkout, tap "Apply Coupon" and enter your code. Valid coupons will show the discount before you confirm payment.',
      },
      {
        id: 'c2',
        question: 'Why is my coupon not working?',
        answer:
          'Coupons may have minimum order requirements, expiry dates, or restaurant restrictions. Check the coupon terms or contact support if the issue persists.',
      },
    ],
  },
  {
    id: 'notifications',
    label: 'Notifications',
    emoji: '🔔',
    items: [
      {
        id: 'n1',
        question: 'How do I turn off promotional notifications?',
        answer:
          'Go to Profile → Notification Preferences and toggle off promotional notifications. Order and delivery alerts are kept on for your safety.',
      },
      {
        id: 'n2',
        question: 'I am not receiving order notifications. What should I do?',
        answer:
          'Ensure notifications are enabled for Cravio in your device settings. Also check that Do Not Disturb mode is off while waiting for delivery.',
      },
    ],
  },
  {
    id: 'donations',
    label: 'Donations',
    emoji: '❤️',
    items: [
      {
        id: 'dn1',
        question: 'What are Cravio Donations?',
        answer:
          'Cravio Donations lets you contribute to social causes at checkout. 100% of your donation goes directly to partner NGOs with no platform fee.',
      },
      {
        id: 'dn2',
        question: 'Can I get a receipt for my donation?',
        answer:
          'Yes, go to Profile → Donations to view your full donation history and download receipts for tax purposes.',
      },
    ],
  },
  {
    id: 'technical',
    label: 'Technical Issues',
    emoji: '🔧',
    items: [
      {
        id: 't1',
        question: 'The app is crashing. What should I do?',
        answer:
          'Try force-closing and reopening the app. If the issue persists, update to the latest version or reinstall. You can also raise a support ticket with details about the crash.',
      },
      {
        id: 't2',
        question: 'The map is not loading in order tracking.',
        answer:
          'Ensure location permissions are enabled for Cravio in your device settings and you have an active internet connection.',
      },
      {
        id: 't3',
        question: 'Images are not loading in the app.',
        answer:
          'This is usually a slow connection issue. Try switching between Wi-Fi and mobile data, or pull down to refresh the page.',
      },
    ],
  },
];

// ─── Ticket types ─────────────────────────────────────────────────────────────

export type TicketStatus = 'pending' | 'open' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high';
export type TicketCategory =
  | 'Order Issue'
  | 'Payment Issue'
  | 'Delivery Issue'
  | 'Account Issue'
  | 'Technical Issue'
  | 'Refund Request'
  | 'Other';

export const TICKET_CATEGORIES: TicketCategory[] = [
  'Order Issue',
  'Payment Issue',
  'Delivery Issue',
  'Account Issue',
  'Technical Issue',
  'Refund Request',
  'Other',
];

export const TICKET_PRIORITIES: TicketPriority[] = ['low', 'medium', 'high'];

export interface TicketMessage {
  id: string;
  sender: 'user' | 'support';
  senderName: string;
  body: string;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  description: string;
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
}

// ─── Mock Tickets ─────────────────────────────────────────────────────────────

export const MOCK_TICKETS: SupportTicket[] = [
  {
    id: 'TKT-1001',
    subject: 'Missing item in my order',
    category: 'Order Issue',
    priority: 'high',
    status: 'open',
    description: 'I ordered a Paneer Tikka but it was not included in the delivery bag.',
    createdAt: '2026-07-30T10:24:00Z',
    updatedAt: '2026-07-30T11:00:00Z',
    messages: [
      {
        id: 'm1',
        sender: 'user',
        senderName: 'You',
        body: 'I ordered a Paneer Tikka but it was not included in the delivery bag.',
        createdAt: '2026-07-30T10:24:00Z',
      },
      {
        id: 'm2',
        sender: 'support',
        senderName: 'Cravio Support',
        body: 'Thank you for reaching out! We are sorry about the missing item. We have raised a refund request for the Paneer Tikka. It will be credited to your Cravio Wallet within 24 hours.',
        createdAt: '2026-07-30T11:00:00Z',
      },
    ],
  },
  {
    id: 'TKT-1002',
    subject: 'Refund not received for cancelled order',
    category: 'Refund Request',
    priority: 'medium',
    status: 'pending',
    description: 'I cancelled order #ORD-5521 three days ago but have not received the refund.',
    createdAt: '2026-07-29T16:45:00Z',
    updatedAt: '2026-07-29T16:45:00Z',
    messages: [
      {
        id: 'm1',
        sender: 'user',
        senderName: 'You',
        body: 'I cancelled order #ORD-5521 three days ago but have not received the refund.',
        createdAt: '2026-07-29T16:45:00Z',
      },
    ],
  },
  {
    id: 'TKT-1003',
    subject: 'App crashing on order tracking screen',
    category: 'Technical Issue',
    priority: 'low',
    status: 'resolved',
    description: 'The app crashes every time I open the live tracking screen.',
    createdAt: '2026-07-25T09:00:00Z',
    updatedAt: '2026-07-26T14:30:00Z',
    messages: [
      {
        id: 'm1',
        sender: 'user',
        senderName: 'You',
        body: 'The app crashes every time I open the live tracking screen.',
        createdAt: '2026-07-25T09:00:00Z',
      },
      {
        id: 'm2',
        sender: 'support',
        senderName: 'Cravio Support',
        body: 'We have identified this as a known issue with app version 0.9.8. Please update the app to version 1.0.0 — this issue has been fixed.',
        createdAt: '2026-07-26T14:30:00Z',
      },
    ],
  },
  {
    id: 'TKT-1004',
    subject: 'Payment deducted but order not placed',
    category: 'Payment Issue',
    priority: 'high',
    status: 'closed',
    description: 'Amount was deducted from my account but the order shows as failed.',
    createdAt: '2026-07-20T12:00:00Z',
    updatedAt: '2026-07-21T10:00:00Z',
    messages: [
      {
        id: 'm1',
        sender: 'user',
        senderName: 'You',
        body: 'Amount was deducted from my account but the order shows as failed.',
        createdAt: '2026-07-20T12:00:00Z',
      },
      {
        id: 'm2',
        sender: 'support',
        senderName: 'Cravio Support',
        body: 'We have verified the payment. A full refund of ₹349 has been initiated to your original payment method. Please allow 5–7 business days.',
        createdAt: '2026-07-21T10:00:00Z',
      },
    ],
  },
];

// ─── Contact info ─────────────────────────────────────────────────────────────

export const SUPPORT_CONTACT = {
  email: 'support@cravioapp.in',
  phone: '+91-80-4711-0000',
  whatsapp: '+918047110000',
  website: 'https://cravioapp.in/support',
  businessHours: 'Mon – Sat, 9:00 AM – 9:00 PM IST',
};
