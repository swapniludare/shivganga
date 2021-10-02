import { Component, Input, OnInit } from '@angular/core';
interface ITimer {
  seconds: number;
  secondsRemaining: number;
  runTimer: boolean;
  hasStarted: boolean;
  hasFinished: boolean;
  displayTime: string;
}
@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
})
export class TimerComponent implements OnInit {
  @Input() process : any;
  @Input() start: any;
  @Input() id : string;
  public timer: ITimer;
  public timeInSeconds : number;
  public startInSeconds : number;
  constructor() { }

  ngOnInit() {
    let endtime = new Date(this.start.toDate().getTime()+this.getProcessElements('time')).getTime();
    let starttime = new Date().getTime();
    this.timeInSeconds = ((endtime-starttime)/1000);
    this.timer = <ITimer>{
      seconds: this.timeInSeconds,
      runTimer: true,
      hasStarted: true,
      hasFinished: false,
      secondsRemaining: this.timeInSeconds
    };
    if(this.timeInSeconds < 0) {
      this.timer.hasFinished = true;
    }
    this.timer.displayTime = this.getSecondsAsDigitalClock(this.timer.secondsRemaining);
    this.timerTick();
  }

  getProcessElements(type:string) {
    return this.process.find(x=> x.id==this.id)[type];
  }

  timerTick() {
    setTimeout(() => {
        if (!this.timer.runTimer) { return; }
        this.timer.secondsRemaining--;
        this.timer.displayTime = this.getSecondsAsDigitalClock(this.timer.secondsRemaining);
        if (this.timer.secondsRemaining > 0) {
            this.timerTick();
        }
        else {
            this.timer.hasFinished = true;
        }
    }, 1000);
}

getSecondsAsDigitalClock(inputSeconds: number) {
    var sec_num = parseInt(inputSeconds.toString(), 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);
    var hoursString = '';
    var minutesString = '';
    var secondsString = '';
    hoursString = (hours < 10) ? "0" + hours : hours.toString();
    minutesString = (minutes < 10) ? "0" + minutes : minutes.toString();
    secondsString = (seconds < 10) ? "0" + seconds : seconds.toString();
    return hoursString + ':' + minutesString + ':' + secondsString;
}

}
