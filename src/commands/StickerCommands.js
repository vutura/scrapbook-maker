// src/commands/StickerCommands.js
export class MoveStickerCommand {
    constructor(stickerId, oldPosition, newPosition, updatePosition) {
      this.stickerId = stickerId;
      this.oldPosition = oldPosition;
      this.newPosition = newPosition;
      this.updatePosition = updatePosition;
    }
  
    execute() {
      this.updatePosition(this.stickerId, this.newPosition);
    }
  
    undo() {
      this.updatePosition(this.stickerId, this.oldPosition);
    }
  }
  
  export class RotateStickerCommand {
    constructor(stickerId, oldRotation, newRotation, updatePosition) {
      this.stickerId = stickerId;
      this.oldRotation = oldRotation;
      this.newRotation = newRotation;
      this.updatePosition = updatePosition;
    }
  
    execute() {
      this.updatePosition(this.stickerId, { rotation: this.newRotation });
    }
  
    undo() {
      this.updatePosition(this.stickerId, { rotation: this.oldRotation });
    }
  }
  
  export class ResizeStickerCommand {
    constructor(stickerId, oldSize, newSize, updatePosition) {
      this.stickerId = stickerId;
      this.oldSize = oldSize;
      this.newSize = newSize;
      this.updatePosition = updatePosition;
    }
  
    execute() {
      this.updatePosition(this.stickerId, {
        width: this.newSize.width,
        height: this.newSize.height
      });
    }
  
    undo() {
      this.updatePosition(this.stickerId, {
        width: this.oldSize.width,
        height: this.oldSize.height
      });
    }
  }
