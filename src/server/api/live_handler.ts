import { formatSnapshot } from './live/format';
import { startServer } from './live/json_server';

let views: any[] = [];

startServer((message: any) => {
  const content = message.content;
  const snapshotName = message.snapshotName;

  views = views.filter(s => Date.now() - s.time < 1500);

  // find index of snapshot with the current name
  const index = views.findIndex(s => s.snapshotName === snapshotName);

  console.log('Received: ' + message.snapshotName);

  // format content in html form
  message.content = formatSnapshot(content);
  message.expected = message.expected && formatSnapshot(message.expected);

  // insert into cache
  if (index >= 0) {
    views[index] = message;
  } else {
    views.unshift(message);
  }

  // console.log('Added: ' + message.snapshotName);

  // remove last element
  if (views.length > 5) {
    views.splice(4, 1);
  }
});

export const liveApi = (_req: any, res: any) => res.send(views);
