"use client";

import type {
  AdminDashboardStats,
  AdminLogItem,
  AdminLogListParams,
  AdminPaymentItem,
  AdminPaymentListParams,
  AdminRevenue,
  AdminSession,
  AdminUserDetail,
  AdminUserListItem,
  AdminUserListParams,
  PaginatedResponse,
} from "@/shared/_utils/backend-admin-client";

const STORAGE_KEYS = {
  logs: "duitku:mock:admin:logs",
  payments: "duitku:mock:admin:payments",
  users: "duitku:mock:admin:users",
} as const;

const mockAdminSession: AdminSession = {
  accessToken: "mock-admin-access-token",
  admin: {
    created_at: "2026-01-01T08:00:00.000Z",
    id: "adm-001",
    role: "superadmin",
    username: "admin",
  },
  expiresIn: 3600,
  refreshToken: "mock-admin-refresh-token",
};

const initialUsers: AdminUserListItem[] = [
  {
    balance: 245000,
    created_at: "2026-04-02T09:10:00.000Z",
    email: "raka@example.com",
    id: "usr-001",
    is_active: true,
    name: "Raka Pratama",
    phone: "6281211112222",
    plan_type: "pro",
    timezone: "Asia/Jakarta",
    updated_at: "2026-04-30T13:21:00.000Z",
  },
  {
    balance: 72000,
    created_at: "2026-03-24T12:45:00.000Z",
    email: "nadia@example.com",
    id: "usr-002",
    is_active: true,
    name: "Nadia Putri",
    phone: "6281322223333",
    plan_type: "free",
    timezone: "Asia/Makassar",
    updated_at: "2026-04-29T08:18:00.000Z",
  },
  {
    balance: 0,
    created_at: "2026-03-15T15:30:00.000Z",
    email: null,
    id: "usr-003",
    is_active: false,
    name: "Dimas Wibowo",
    phone: "6281433334444",
    plan_type: "free",
    timezone: "Asia/Jakarta",
    updated_at: "2026-04-22T19:00:00.000Z",
  },
  {
    balance: 520000,
    created_at: "2026-02-27T06:12:00.000Z",
    email: "sari@example.com",
    id: "usr-004",
    is_active: true,
    name: "Sari Anggraini",
    phone: "6281544445555",
    plan_type: "business",
    timezone: "Asia/Jakarta",
    updated_at: "2026-04-28T10:05:00.000Z",
  },
  {
    balance: 128000,
    created_at: "2026-01-19T11:05:00.000Z",
    email: "bayu@example.com",
    id: "usr-005",
    is_active: true,
    name: "Bayu Santoso",
    phone: "6281655556666",
    plan_type: "pro",
    timezone: "Asia/Jayapura",
    updated_at: "2026-04-25T14:33:00.000Z",
  },
  {
    balance: 34000,
    created_at: "2026-01-09T07:55:00.000Z",
    email: "lara@example.com",
    id: "usr-006",
    is_active: false,
    name: "Laras Hapsari",
    phone: "6281766667777",
    plan_type: "free",
    timezone: "Asia/Jakarta",
    updated_at: "2026-04-18T09:42:00.000Z",
  },
];

const initialPayments: AdminPaymentItem[] = [
  {
    amount: 150000,
    created_at: "2026-04-30T12:00:00.000Z",
    description: "Top up saldo Pro",
    id: "pay-001",
    status: "pending",
    type: "topup",
    user_id: "usr-001",
    user_name: "Raka Pratama",
    user_phone: "6281211112222",
  },
  {
    amount: 250000,
    created_at: "2026-04-29T10:30:00.000Z",
    description: "Paket Business",
    id: "pay-002",
    status: "verified",
    type: "topup",
    user_id: "usr-004",
    user_name: "Sari Anggraini",
    user_phone: "6281544445555",
    verified_at: "2026-04-29T11:00:00.000Z",
    verified_by: "adm-001",
  },
  {
    amount: 75000,
    created_at: "2026-04-27T15:20:00.000Z",
    description: "Top up reguler",
    id: "pay-003",
    status: "rejected",
    type: "topup",
    user_id: "usr-002",
    user_name: "Nadia Putri",
    user_phone: "6281322223333",
  },
  {
    amount: 100000,
    created_at: "2026-04-26T16:44:00.000Z",
    description: "Top up saldo",
    id: "pay-004",
    status: "pending",
    type: "topup",
    user_id: "usr-005",
    user_name: "Bayu Santoso",
    user_phone: "6281655556666",
  },
];

const initialLogs: AdminLogItem[] = [
  {
    action: "login",
    admin_id: "adm-001",
    admin_username: "admin",
    created_at: "2026-04-30T09:00:00.000Z",
    detail: "Mock admin login",
    id: "log-001",
  },
  {
    action: "verify_payment",
    admin_id: "adm-001",
    admin_username: "admin",
    created_at: "2026-04-29T11:00:00.000Z",
    detail: "Verified payment pay-002",
    id: "log-002",
    target_id: "pay-002",
    target_type: "payment",
  },
];

export function mockAdminLogin(username: string, password: string) {
  if (!password.trim()) {
    throw new Error("Password admin mock wajib diisi.");
  }

  return {
    ...mockAdminSession,
    admin: {
      ...mockAdminSession.admin,
      username: username.trim() || mockAdminSession.admin.username,
    },
  };
}

export function getMockAdminDashboard(): AdminDashboardStats {
  const users = getMockUsers();
  const payments = getMockPayments();
  const verifiedRevenue = sumPaymentsByStatus(payments, "verified");

  return {
    active_users: users.filter((user) => user.is_active).length,
    churn_this_month: users.filter((user) => !user.is_active).length,
    infra_cost_this_month: 85000,
    net_profit: verifiedRevenue - 145000,
    new_users_this_month: users.filter((user) =>
      user.created_at.startsWith("2026-04")
    ).length,
    pending_payments: payments.filter((payment) => payment.status === "pending").length,
    profit_split: {
      ai: 42000,
      infra: 85000,
      referral: 18000,
    },
    referral_cost_this_month: 18000,
    revenue_change_percent: 12.4,
    revenue_prev_month: 315000,
    revenue_this_month: verifiedRevenue,
    suspended_users: users.filter((user) => !user.is_active).length,
    total_users: users.length,
  };
}

export function listMockAdminUsers(
  params: AdminUserListParams = {}
): PaginatedResponse<AdminUserListItem> {
  const search = params.search?.trim().toLowerCase() ?? "";
  const status = params.status ?? "";
  const order = params.order ?? "desc";
  const sort = params.sort ?? "created_at";

  let users = getMockUsers();

  if (status === "active") {
    users = users.filter((user) => user.is_active);
  }
  if (status === "inactive" || status === "suspended") {
    users = users.filter((user) => !user.is_active);
  }
  if (search) {
    users = users.filter((user) =>
      [user.name, user.phone, user.email ?? ""].some((value) =>
        value.toLowerCase().includes(search)
      )
    );
  }

  users = [...users].sort((left, right) => {
    const direction = order === "asc" ? 1 : -1;

    if (sort === "balance") {
      return (left.balance - right.balance) * direction;
    }

    return String(left[sort]).localeCompare(String(right[sort])) * direction;
  });

  return paginate(users, params.page, params.perPage);
}

export function getMockAdminUserDetail(userId: string): AdminUserDetail {
  const user = getMockUsers().find((item) => item.id === userId) ?? getMockUsers()[0];
  const userPayments = getMockPayments().filter(
    (payment) => payment.user_id === user.id
  );

  return {
    balance: {
      balance: user.balance,
      plan_type: user.plan_type,
      updated_at: user.updated_at,
      user_id: user.id,
    },
    payments: userPayments,
    stats: {
      ai_cost_this_month: user.plan_type === "free" ? 1200 : 18500,
      member_since_days: daysSince(user.created_at),
      registered_via_referral: user.id === "usr-002" ? "RAKA2026" : null,
      total_ai_calls_this_month: user.plan_type === "free" ? 12 : 142,
      total_transactions: user.plan_type === "business" ? 310 : 64,
      total_wa_messages_this_month: user.plan_type === "free" ? 8 : 93,
    },
    user,
  };
}

export function updateMockAdminUserStatus(input: {
  isActive: boolean;
  reason: string;
  userId: string;
}) {
  const users = getMockUsers().map((user) =>
    user.id === input.userId
      ? {
          ...user,
          is_active: input.isActive,
          updated_at: new Date().toISOString(),
        }
      : user
  );

  writeStoredValue(STORAGE_KEYS.users, users);
  appendLog("update_user_status", input.userId, "user", input.reason);

  return { is_active: input.isActive };
}

export function addMockAdminUserBalance(input: {
  amount: number;
  description: string;
  userId: string;
}) {
  let nextBalance = 0;
  const users = getMockUsers().map((user) => {
    if (user.id !== input.userId) {
      return user;
    }

    nextBalance = user.balance + input.amount;

    return {
      ...user,
      balance: nextBalance,
      updated_at: new Date().toISOString(),
    };
  });

  writeStoredValue(STORAGE_KEYS.users, users);
  appendLog("add_user_balance", input.userId, "user", input.description);

  return { new_balance: nextBalance };
}

export function listMockAdminPayments(
  params: AdminPaymentListParams = {}
): PaginatedResponse<AdminPaymentItem> {
  let payments = getMockPayments();

  if (params.status?.trim()) {
    payments = payments.filter((payment) => payment.status === params.status);
  }

  payments = [...payments].sort((left, right) =>
    right.created_at.localeCompare(left.created_at)
  );

  return paginate(payments, params.page, params.perPage);
}

export function verifyMockAdminPayment(paymentId: string) {
  const payments = getMockPayments().map((payment) =>
    payment.id === paymentId
      ? {
          ...payment,
          status: "verified",
          verified_at: new Date().toISOString(),
          verified_by: mockAdminSession.admin.id,
        }
      : payment
  );
  const payment = payments.find((item) => item.id === paymentId);

  writeStoredValue(STORAGE_KEYS.payments, payments);
  appendLog("verify_payment", paymentId, "payment", "Mock payment verified");

  return {
    expires_at: null,
    new_balance: payment ? getUserBalance(payment.user_id) + payment.amount : 0,
    payment_id: paymentId,
  };
}

export function rejectMockAdminPayment(paymentId: string) {
  const payments = getMockPayments().map((payment) =>
    payment.id === paymentId ? { ...payment, status: "rejected" } : payment
  );

  writeStoredValue(STORAGE_KEYS.payments, payments);
  appendLog("reject_payment", paymentId, "payment", "Mock payment rejected");

  return null;
}

export function getMockAdminRevenue(month: string): AdminRevenue {
  const revenue = sumPaymentsByStatus(getMockPayments(), "verified");
  const referralPayout = 18000;
  const cost = {
    ai: 42000,
    infra: 85000,
    referral: referralPayout,
  };

  return {
    cost,
    month,
    net_profit: revenue - cost.ai - cost.infra - cost.referral,
    profit_split: {
      platform: Math.round(revenue * 0.68),
      referral: Math.round(revenue * 0.12),
      reserve: Math.round(revenue * 0.2),
    },
    referral_payout: referralPayout,
    revenue,
    trend: [
      { month: "2026-02", revenue: 225000 },
      { month: "2026-03", revenue: 315000 },
      { month, revenue },
    ],
  };
}

export function getMockAdminReferralOverview() {
  return {
    active_referrers: 8,
    pending_payout: 18000,
    total_commission: 126000,
    total_referred_users: 31,
  };
}

export function createMockAdminReferralPayout(input: {
  period: string;
  referralCode: string;
}) {
  appendLog(
    "create_referral_payout",
    input.referralCode,
    "referral",
    `Mock payout for ${input.period}`
  );

  return {
    amount: 18000,
    period: input.period,
    referral_code: input.referralCode,
    status: "paid",
  };
}

export function getMockAdminLogs(
  params: AdminLogListParams = {}
): PaginatedResponse<AdminLogItem> {
  let logs = getMockLogs();

  if (params.adminId?.trim()) {
    logs = logs.filter((log) => log.admin_id === params.adminId);
  }
  if (params.action?.trim()) {
    logs = logs.filter((log) => log.action === params.action);
  }

  logs = [...logs].sort((left, right) =>
    right.created_at.localeCompare(left.created_at)
  );

  return paginate(logs, params.page, params.perPage);
}

function getMockUsers() {
  return readStoredValue(STORAGE_KEYS.users, initialUsers);
}

function getMockPayments() {
  return readStoredValue(STORAGE_KEYS.payments, initialPayments);
}

function getMockLogs() {
  return readStoredValue(STORAGE_KEYS.logs, initialLogs);
}

function getUserBalance(userId: string) {
  return getMockUsers().find((user) => user.id === userId)?.balance ?? 0;
}

function sumPaymentsByStatus(payments: AdminPaymentItem[], status: string) {
  return payments
    .filter((payment) => payment.status === status)
    .reduce((total, payment) => total + payment.amount, 0);
}

function appendLog(
  action: string,
  targetId?: string,
  targetType?: string,
  detail?: string
) {
  const logs = [
    {
      action,
      admin_id: mockAdminSession.admin.id,
      admin_username: mockAdminSession.admin.username,
      created_at: new Date().toISOString(),
      detail,
      id: createMockId("log"),
      target_id: targetId,
      target_type: targetType,
    },
    ...getMockLogs(),
  ];

  writeStoredValue(STORAGE_KEYS.logs, logs);
}

function daysSince(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  return Math.max(1, Math.floor(diff / 86_400_000));
}

function paginate<T>(
  items: T[],
  pageValue = 1,
  perPageValue = 20
): PaginatedResponse<T> {
  const page = Math.max(1, pageValue);
  const perPage = Math.min(100, Math.max(1, perPageValue));
  const start = (page - 1) * perPage;

  return {
    items: items.slice(start, start + perPage),
    page,
    per_page: perPage,
    total: items.length,
  };
}

function isBrowser() {
  return typeof window !== "undefined";
}

function readStoredValue<T>(key: string, fallback: T): T {
  if (!isBrowser()) {
    return fallback;
  }

  try {
    const storedValue = window.localStorage.getItem(key);
    return storedValue ? (JSON.parse(storedValue) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStoredValue<T>(key: string, value: T) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

function createMockId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}`;
}
