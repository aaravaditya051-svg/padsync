// responsibility: generates a 6-character room code like ABC-123
export function generateRoomCode(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  
  let p1 = '';
  for(let i=0; i<3; i++) {
    p1 += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  
  let p2 = '';
  for(let i=0; i<3; i++) {
    p2 += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }
  
  return `${p1}-${p2}`;
}
