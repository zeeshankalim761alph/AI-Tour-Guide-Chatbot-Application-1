import { Message, Role } from '../types';

export const downloadChatAsText = (messages: Message[]) => {
  const content = messages.map(m => {
    const sender = m.role === Role.USER ? "You" : "Guide";
    const time = new Date(m.timestamp).toLocaleString();
    return `[${time}] ${sender}:\n${m.text}\n${'-'.repeat(40)}\n`;
  }).join('\n');

  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `wanderlust-itinerary-${new Date().toISOString().split('T')[0]}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};