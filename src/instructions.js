const INSTRUCTIONS = {
  BLUE: new Uint8Array([0x38, 0, 0, 0, 0x36]),
  GREEN: new Uint8Array([0x38, 0, 0, 0, 0x12]),
  SET_MODE: mode => new Uint8Array([0x38, mode, 0x00, 0x00, 0x2c]),
  TOGGLE_POWER: new Uint8Array([0x38, 0, 0, 0, 0xaa]),
}

export default INSTRUCTIONS
