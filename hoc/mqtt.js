import Paho from "paho-mqtt";
import React from "react";
import { getCookiees, setCookie, getCookie } from "../lib/session";
import {
  MQTT_PASSWORD,
  MQTT_URL,
  MQTT_USERNAME,
  MQTT_TOPIC,
  CHAT_MESSAGE_BEEP,
} from "../lib/config";

import {
  PublishMessage,
  newMessageCame,
  publishAck,
  ackCame,
  sendAck,
  offlineStatus,
  onlineStatus,
  subscribe,
  unsubscribe,
  sendTypingAck,
  sendBlockMessage,
  sendBlock,
  publishShoutOut,
  PublishCustomMessage,
} from "../lib/chat";
import {
  messageSubject,
  ackSubject,
  unsubscribeTopic,
  subscribeTopic,
  userStatus,
  userTypingStatus,
  sendTypeAck,
  userBlock,
  userBlockStatus,
  reConnectionSubject,
  OnlineOfflineSubject,
  endCurrentViewStream,
  animateBroadcasterStream,
  shoutoutOutgoing,
  shoutoutIncoming,
  pushMessageToConferenceSubject,
  customMessageSubject
} from "../lib/rxSubject";

import { newMessage, changeUserStatus } from "../redux/actions/chat/action";
import { removeStreamAction, setLiveStreams } from "../redux/actions/liveStream/liveStream";
import { setUpdateAcknowledgementStatus } from "../redux/actions/auth";

let client = {};
let userList = {};
export const unsubscibeMqqtTopic = () => {
  try {
    client.unsubscribe(MQTT_TOPIC.Message + "/" + userId, { qos: 1 });
    client.unsubscribe(MQTT_TOPIC.Acknowledgement + "/" + userId), { qos: 1 };
    client.unsubscribe(MQTT_TOPIC.Calls + "/" + userId, { qos: 1 });
    client.unsubscribe(MQTT_TOPIC.UserUpdates + "/" + userId, { qos: 1 });
    client.unsubscribe(MQTT_TOPIC.FetchMessages + "/" + userId, {
      qos: 1,
    });

    client.unsubscribe(MQTT_TOPIC.OnlineStatus + "/" + userId, {
      qos: 1,
    });
  } catch (e) {
    console.error("MQTT CONNECTION ERROR", e);
  }
};

class MQTTc extends React.Component {
  constructor(props) {
    super(props);

    try {
      this.messageSubjectRxObject = messageSubject.subscribe((data) => {
        PublishMessage(data, client, this.props.store);
      });
      this.customMessageSubjectRxObject = customMessageSubject.subscribe((data) => {
        const { payloadToSend, topicToSend } = data;
        PublishCustomMessage({ payloadToSend, topicToSend, client });
      })
      this.reConnectionSubjectRxObject = reConnectionSubject.subscribe(() => {
        this.connection();
      });
      this.fackSubjectRxObject = ackSubject.subscribe((data) => {
        publishAck(data, client, this.props.store);
      });
      this.subscribeTopicRxObject = subscribeTopic.subscribe((topic) => {
        subscribe(topic, client);
      });
      this.unsubscribeTopicRxObject = unsubscribeTopic.subscribe((topic) => {
        unsubscribe(topic, client);
      });
      this.sendTypeRxObject = sendTypeAck.subscribe((data) => {
        sendTypingAck(client, data);
      });
      this.sendBlockRxObject = userBlockStatus.subscribe((data) => {
        sendBlock(client, data);
      });
      this.shoutoutHandel = shoutoutOutgoing.subscribe((data) => {
        publishShoutOut(data, client);
      });
      // EventEmitter.subscribe("onMessage", (data) => {

      // let topic = MQTT_TOPIC.Message + "/" + data.targetUserId;
      // let message = new Paho.Message(JSON.stringify(data));
      // message.destinationName = topic;
      // client.send(message);
      // });
      this.onlineOfflineSubjectRxObject = OnlineOfflineSubject.subscribe(flag => {
        //   console.log('onlineStatus :::::', flag)
        //   if (flag) {
        //     onlineStatus(client)
        //   } else {
        //     offlineStatus(client)
        //   }
      })
    } catch (e) {
      console.error("mqtt connection", e);
    }
  }

  onMessageArrived = (message) => {

    try {
      let mqttData = JSON.parse(message.payloadString);

      // Universal Message Received
      if (message.topic.includes(MQTT_TOPIC.universalMessage)) {
        this.props.store.dispatch(setUpdateAcknowledgementStatus(false));
      }

      if (message.topic.includes(MQTT_TOPIC.virtualOrder)) {
        console.log(mqttData, 'is the data got @@ vortual order');
        if (mqttData.orderType === "VIDEO_CALL" && ["EXTENSION_REJECTED", "EXTENSION_REQUESTED", "EXTENSION_ACCEPTED", "COMPLETED"].includes(mqttData.status)) {
          pushMessageToConferenceSubject.next(mqttData);
        }
      }
      // console.log("\n\n\n\n\ Action", message, '\n\n\n\n\n\n');

      if (message.topic.includes(MQTT_TOPIC.blockUser)) {
        userBlock.next(mqttData);
        return;
      }
      if (message.topic.includes(MQTT_TOPIC.streamSentTip)) {
        // console.log(message, 'is the message rec ==>>');
        animateBroadcasterStream.next({ type: "GOT TIP", data: mqttData, topic: message.topic });
        return;
      }
      if (mqttData.topic && mqttData.topic.includes(MQTT_TOPIC.shoutout)) {
        shoutoutIncoming.next(mqttData)
        return;
      }
      if (message.topic.includes(MQTT_TOPIC.streamStarted)) {
        const popularStreamList = this.props.store.getState().liveStream.POPULAR_STREAMS;
        const streamUserId = this.props.store.getState().profileData.isometrikUserId;
        if (mqttData.userId == streamUserId) return; // No Need to Add Self Created Stream in List
        // console.log('--> Got Data for New Stream', mqttData, 'and old Data', popularStreamList);
        if (popularStreamList.data.length) { // Getting All Added Popular Stream From Redux
          const addedStreamIdArr = popularStreamList.data.map(stream => stream.streamId);
          if (!addedStreamIdArr.includes(mqttData.streamId)) { // Checking If Mqtt Stream is Not Already Added
            const streamType = 3; // Popular Streams
            const streamStatus = 1 // Active
            // console.log('---> Setting New Data');
            this.props.store.dispatch(setLiveStreams(streamType, streamStatus, [mqttData], popularStreamList.totalCount, popularStreamList.page));
          }
        }
      }

      if (message.topic.includes(MQTT_TOPIC.streamStopped)) {
        const streamId = mqttData.streamId;
        console.log('Sent from here -->>', mqttData);
        const currentStreamViewing = this.props.store.getState().liveStream.CURRENT_STREAM_DATA?.streamUserInfo?.streamId || null;
        if (!currentStreamViewing) {
          // console.log(currentStreamViewing, 'is the viewing ==>>', this.props.store.getState().liveStream.CURRENT_STREAM_DATA?.streamUserInfo);
          this.props.store.dispatch(removeStreamAction(streamId));
        }
        endCurrentViewStream.next(streamId);
      }
      if (mqttData.secretId) {
        userTypingStatus.next(mqttData);
      }
      if (mqttData.topic && mqttData.topic.includes(MQTT_TOPIC.Message)) {
        // console.log("mqtt dataaerived", mqttData); // ur data comes over here
        newMessageCame(this.props.store, mqttData);
        if (!mqttData.selfMessage) {
          var audio = document.getElementById("audio_beep");
          audio.play();
        }
      } else {
        if (mqttData.chatId) {
          // console.log("mqtt dataaerived", mqttData); // ur data comes over here
          ackCame(this.props.store, mqttData);
        } else if (typeof mqttData.lastSeenEnabled != "undefined") {
          let userId = getCookie("uid");
          if (mqttData.status == 0 && mqttData.userId == userId) {
            onlineStatus(client);
          } else if (mqttData.userId != userId) {
            // console.log("get chat acknolagement", mqttData);
            if (mqttData.status == 0) {
              // console.log("", this.props.store.getState().chat.userList);
              this.props.store.getState().chat.userList[mqttData.userId]
                ? (userList[mqttData.userId] = setTimeout(() => {
                  this.props.store.dispatch(changeUserStatus(mqttData));
                }, 3000))
                : this.props.store.dispatch(changeUserStatus(mqttData));

              // console.log("get chat acknolagement offline", mqttData);
            } else {
              // console.log("\n\n\n\n\nmqttData----", mqttData, '\n\n\n\n\n\n');
              // console.log("scjsacnjsnjcc asdsad", userList);
              userList[mqttData.userId] &&
                clearTimeout(userList[mqttData.userId]);
              this.props.store.dispatch(changeUserStatus(mqttData));

              // console.log("get chat acknolagement online", mqttData);
            }
          }
        } else if (typeof mqttData.secretId != "undefined") {
        }
        // sendAck(this.props.store, mqttData);
      }
      // console.log('MQTT message sent successfully !');
    } catch (e) {
      console.error("message derived error", e);
    }

    // } else {
    // console.log("acknolagementcame", mqttData);
    // newMessageCame(this.props.store, mqttData);
    // }
    // this.props.store.dispatch(newMessage());
  };

  connection = () => {
    let userId = getCookie("uid");
    if (userId) {
      // let clientId = Date.now().toString();
      client = new Paho.Client(MQTT_URL, userId);
      client.connect({
        userName: MQTT_USERNAME,
        password: MQTT_PASSWORD,
        useSSL: true,
        mqttVersion: 3,
        keepAliveInterval: 3,
        willMessage: offlineStatus(),
        cleanSession: false,
        reconnect: true,
        onFailure: (e) => {
          this.connection();
        },

        onSuccess: (res) => {
          // setCookie("connected", "true");
          // console.log("mqtt connected [chat]", client.isConnected());
          try {
            client.subscribe(MQTT_TOPIC.universalMessage, { qos: 0, onSuccess: (successObj) => {
              console.log('Subscribed Successfully:: =>> universalMessage', successObj);
            }, onFailure: (failObj) => {
              console.log('Subscribed Failed || universalMessage',failObj);
            } });
            // console.log('MQTT client connected successfully !');
            client.subscribe(MQTT_TOPIC.virtualOrder + '/' + userId, {
              qos: 0, onSuccess: (successObj) => {
                console.log('Subscribed Successfully:: ===>> Virtual Order', successObj);
              }, onFailure: (failObj) => {
                console.log('Subscribed Failed || Virtual Order >>', failObj);
              }
            });
            client.subscribe(MQTT_TOPIC.Message + "/" + userId, { qos: 1 });
            client.subscribe(MQTT_TOPIC.Acknowledgement + "/" + userId),
              { qos: 1 };
            client.subscribe(MQTT_TOPIC.Calls + "/" + userId, { qos: 1 });
            client.subscribe(MQTT_TOPIC.UserUpdates + "/" + userId, { qos: 1 });
            client.subscribe(MQTT_TOPIC.FetchMessages + "/" + userId, {
              qos: 1,
            });
            // client.subscribe(MQTT_TOPIC.typ + "/" + userId);
            client.subscribe(MQTT_TOPIC.OnlineStatus + "/" + userId, {
              qos: 1,
            });

            client.subscribe(MQTT_TOPIC.streamStarted, { qos: 1 })
            client.subscribe(MQTT_TOPIC.streamStopped, { qos: 1 })
            // client.subscribe(MQTT_TOPIC.streamSentTip, { qos: 1, onSuccess: (successObj) => {
            //   console.log('Subscribed Successfully:: =>> StreamSentTip', successObj);
            // }, onFailure: (failObj) => {
            //   console.log('Subscribed Failed StreamSentTip || >>',failObj);
            // } })

            // onlineStatus(client);
            // client.subscribe(MQTT_TOPIC.OnlineStatus + "/" + userId);
            // message.destinationName = "Message/5e91625772b5bd0031ba5887";
            // client.send(message);
            // setInterval(() => {
            //   onlineStatus(client);
            // }, 5000);
            onlineStatus(client);
            client.onMessageArrived = this.onMessageArrived;
          } catch (e) {
            console.error("mqtt connection error", e);
          }
        },
      });

      client.onConnectionLost = () => {
        setCookie("connected", "false");
      };
    }
  };

  componentWillUnmount() {
    // window.removeEventListener("beforeunload", this.unloadEvent);
    if (typeof client != "string") {
      try {
        offlineStatus(client);
        this.fackSubjectRxObject.unsubscribe();
        this.messageSubjectRxObject.unsubscribe();
        this.subscribeTopicRxObject.unsubscribe();
        this.unsubscribeTopicRxObject.unsubscribe();
        this.sendTypeRxObject.unsubscribe();
        this.sendBlockRxObject.unsubscribe();
        this.shoutoutHandel.unsubscribe();
        this.customMessageSubjectRxObject.unsubscribe();
        shoutoutIncoming.unsubscribe();
        // client.disconnect();
      } catch (e) {
        console.error(e)
      }
    }
  }

  componentDidMount() {
    this.connection();
  }

  render() {
    return (
      <div>
        {this.props.render(client)}
        <audio
          id="audio_beep"
          src={CHAT_MESSAGE_BEEP}
          style={{ display: "none" }}
        ></audio>
      </div>
    );
  }
}

export default MQTTc;
