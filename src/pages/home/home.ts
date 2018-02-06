import { Component, NgZone, ViewChild } from '@angular/core';
import { NavController,Content } from 'ionic-angular';
import { TextToSpeech } from '@ionic-native/text-to-speech';
// import { Content } from 'ionic-angular/components/content/content';

declare var window;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  messages: any[] = [];
  text:string;
  @ViewChild(Content) messageContent: Content;

  constructor(public navCtrl: NavController, public ngZone: NgZone, public tts: TextToSpeech) {
    this.messages.push({
      text: "Hi, How can I help you?",
      sender: "api" 
    });
  }

  sendText(){
    this.messages.push({
      text: this.text,
      sender: "me" 
    });

    window["ApiAIPlugin"].requestText({
      query:this.text
    },
    (response)=>{

      this.ngZone.run(()=>{
        this.messages.push({
          text: response.result.fulfillment.speech,
          sender: "api" 
        });
      });
      this.messageContent.scrollToBottom(200);
    },
    (error)=>{alert(error)})
    this.text = "";    
  }

  sendVoice(){

    window["ApiAIPlugin"].requestVoice({},
    (response)=>{
      this.ngZone.run(()=>{
        this.messages.push({
          text: response.result.fulfillment.speech,
          sender: "api" 
        });
      });
      this.messageContent.scrollToBottom(200);

      this.tts.speak({
        text: response.result.fulfillment.speech,
        locale: 'en-IN',
        rate: 1
      });
    },
    (error)=>{alert(error)}); 

  }
}
