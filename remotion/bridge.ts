import {EventEmitter} from "events";
import {PlayerRef} from "@remotion/player";

/**
Proxy Remotion to behave like HTMLMediaElement
*/
export class RemotionBridge extends EventEmitter {
  private fps: number;
  private player: PlayerRef;
  private time: number;

  constructor(opts: {
    fps: number;
    player: PlayerRef;
  }) {
    super();

    this.fps = opts.fps;
    this.player = opts.player;

    this.listen = this.listen.bind(this);

    this.time = this.player.getCurrentFrame() / this.fps * 1000;

    requestAnimationFrame(this.listen);
  }

  listen() {
    const time = this.player.getCurrentFrame() / this.fps * 1000;
    if (time !== this.time) {
      this.emit("timeupdate", time);
      this.time = time;
    }
    requestAnimationFrame(this.listen);
  }
}
