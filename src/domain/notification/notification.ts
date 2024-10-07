import { UUID, randomUUID } from 'node:crypto';

export type Notification = {
  id: UUID;
  title: string;
  description: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type NotificationInput = {
  title: string;
  description: string;
};

export const notificationFactory = ({
  title,
  description,
}: NotificationInput): Notification => ({
  id: randomUUID(),
  title,
  description,
  read: false,
  createdAt: new Date(),
  updatedAt: new Date(),
});

export const updateNotification = (
  notification: Notification,
  read: boolean,
): Notification => ({
  ...notification,
  read,
  updatedAt: new Date(),
});
