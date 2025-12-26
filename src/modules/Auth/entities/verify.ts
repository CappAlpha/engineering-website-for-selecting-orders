export type VerifyRequest = {
  uid: string;
  code: string;
};

type VerifyOk = { ok: true };
type VerifyErr = { error: string };
export type VerifyResponse = VerifyOk | VerifyErr;

export type ResendRequest = {
  uid: string;
};

type ResendOk = { ok: true };
export type ResendResponse = ResendOk | VerifyErr;
