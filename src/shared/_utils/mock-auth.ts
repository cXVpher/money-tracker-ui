"use client";

import { MOCK_ACCOUNT } from "@/shared/_constants/mock-auth";

const MOCK_SESSION_KEY = "duitku:mock:session";
const MOCK_CREDENTIALS_KEY = "duitku:mock:credentials";
const MOCK_SESSION_CHANGE_EVENT = "duitku:mock-session-change";

export type MockSession = {
  email: string;
  name: string;
  phone: string;
};

type MockCredentials = MockSession & {
  password: string;
};

function isBrowser() {
  return typeof window !== "undefined";
}

function saveMockSession(session: MockSession) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event(MOCK_SESSION_CHANGE_EVENT));
}

function saveMockCredentials(credentials: MockCredentials) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(MOCK_CREDENTIALS_KEY, JSON.stringify(credentials));
}

export function subscribeToMockSession(onStoreChange: () => void) {
  if (!isBrowser()) {
    return () => {};
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === MOCK_SESSION_KEY) {
      onStoreChange();
    }
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(MOCK_SESSION_CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(MOCK_SESSION_CHANGE_EVENT, onStoreChange);
  };
}

export function getMockSessionSnapshot() {
  if (!isBrowser()) {
    return null;
  }

  return window.localStorage.getItem(MOCK_SESSION_KEY);
}

function getStoredMockCredentials(): MockCredentials | null {
  if (!isBrowser()) {
    return null;
  }

  try {
    const rawValue = window.localStorage.getItem(MOCK_CREDENTIALS_KEY);
    return rawValue ? (JSON.parse(rawValue) as MockCredentials) : null;
  } catch {
    return null;
  }
}

export function getMockCredentials() {
  return (
    getStoredMockCredentials() ?? {
      email: MOCK_ACCOUNT.email,
      name: MOCK_ACCOUNT.name,
      password: MOCK_ACCOUNT.password,
      phone: MOCK_ACCOUNT.phone,
    }
  );
}

export function getMockSession(): MockSession | null {
  if (!isBrowser()) {
    return null;
  }

  try {
    const rawValue = window.localStorage.getItem(MOCK_SESSION_KEY);
    return rawValue ? (JSON.parse(rawValue) as MockSession) : null;
  } catch {
    return null;
  }
}

export function loginWithMockAccount(phone: string, password: string) {
  const normalizedPhone = phone.trim();
  const normalizedPassword = password.trim();
  const credentials = getMockCredentials();

  if (
    normalizedPhone !== credentials.phone ||
    normalizedPassword !== credentials.password
  ) {
    return {
      ok: false as const,
      message: "Gunakan akun mock yang tersedia untuk masuk.",
    };
  }

  const session: MockSession = {
    email: credentials.email,
    name: credentials.name,
    phone: credentials.phone,
  };

  saveMockSession(session);

  return {
    ok: true as const,
    session,
  };
}

export function registerMockAccount(input: MockSession & { password: string }) {
  const credentials: MockCredentials = {
    email: input.email.trim() || MOCK_ACCOUNT.email,
    name: input.name.trim() || MOCK_ACCOUNT.name,
    password: input.password.trim() || MOCK_ACCOUNT.password,
    phone: input.phone.trim() || MOCK_ACCOUNT.phone,
  };

  saveMockCredentials(credentials);
  saveMockSession({
    email: credentials.email,
    name: credentials.name,
    phone: credentials.phone,
  });

  return credentials;
}

export function updateMockSessionProfile(input: Partial<MockSession>) {
  const currentSession = getMockSession();

  if (!currentSession) {
    return null;
  }

  const nextSession: MockSession = {
    email: input.email?.trim() || currentSession.email,
    name: input.name?.trim() || currentSession.name,
    phone: input.phone?.trim() || currentSession.phone,
  };

  const currentCredentials = getMockCredentials();
  saveMockCredentials({
    ...currentCredentials,
    email: nextSession.email,
    name: nextSession.name,
    phone: nextSession.phone,
  });
  saveMockSession(nextSession);
  return nextSession;
}

export function updateMockPassword(nextPassword: string) {
  const trimmedPassword = nextPassword.trim();

  if (!trimmedPassword) {
    return null;
  }

  const currentCredentials = getMockCredentials();
  const nextCredentials: MockCredentials = {
    ...currentCredentials,
    password: trimmedPassword,
  };

  saveMockCredentials(nextCredentials);
  return nextCredentials;
}

export function logoutMockAccount() {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(MOCK_SESSION_KEY);
  window.dispatchEvent(new Event(MOCK_SESSION_CHANGE_EVENT));
}

export function getMockInitials(session: MockSession | null) {
  const source = session?.name?.trim() || MOCK_ACCOUNT.name;
  return source
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
