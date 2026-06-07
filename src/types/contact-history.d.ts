export type CreateContactHistoryRequest = {
  content: string;

  userId: string;

  nextContactDate?: string;

  nextContactMemo?: string;
};
