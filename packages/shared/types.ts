// responsibility: defines shared TypeScript types across apps
export type RoomInfo = {
  roomId: string;
};

export type TldrawPatchMessage = {
  roomId: string;
  patch: any;
};
