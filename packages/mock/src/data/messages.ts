import type { Message } from '@cpatracker/types';
import { faker } from '../faker';
import { adminUser } from './users';
import { affiliateUsers } from './affiliates';
import { advertiserUsers } from './advertisers';

const participants = [...affiliateUsers, ...advertiserUsers];

export const messages: Message[] = participants.flatMap((user, i) => {
  const threadId = `thread-${i + 1}`;
  const messageCount = faker.number.int({ min: 1, max: 4 });

  return Array.from({ length: messageCount }, (_, j) => {
    const fromAdmin = j % 2 === 0;
    return {
      id: `${threadId}-message-${j + 1}`,
      threadId,
      senderId: fromAdmin ? adminUser.id : user.id,
      recipientId: fromAdmin ? user.id : adminUser.id,
      body: faker.lorem.sentences({ min: 1, max: 3 }),
      createdAt: faker.date.recent({ days: 20 }).toISOString(),
      readAt: faker.datatype.boolean(0.6) ? faker.date.recent({ days: 10 }).toISOString() : null,
    };
  });
});
