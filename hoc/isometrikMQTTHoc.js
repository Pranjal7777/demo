import React from "react";
import Paho from "paho-mqtt";
import { ISOMETRIK_MQTT_CREDS, ISOMETRIK_MQTT_TOPICS } from "../lib/config";
import { getCookie, isBrowser, setCookie } from "../lib/session";
import { getStreamUserId } from "../lib/global";
import { SubscribeIsometrikTopic, UnSubscribeIsometrikTopic, addNewViewerStream, animateBroadcasterStream, removeThisViewerStream } from "../lib/rxSubject";
import { setIsometrikMqttState, setMessageStreamAction, viewerCountUpdateAction, viewerJoinedStream, viewerLeftStream } from '../redux/actions/liveStream/liveStream';
import { useSelector } from "react-redux";
import { subscribe, unsubscribe } from "../lib/chat";
import { isAgency } from "../lib/config/creds";
import { getDeviceId } from "../lib/helper/detectDevice";

let client = {};
const isometrikMQTTHoc = (props) => {
  const { store } = props;
  const streamUserId = store.getState().profileData?.isometrikUserId;
  const { URL, Username, Password } = ISOMETRIK_MQTT_CREDS;
  const uid = isAgency() ? getCookie("selectedCreatorId") : getCookie("uid")
  const onMessageArrived = (message) => {
    try {
      let mqttData = JSON.parse(message.payloadString); // Parsing the Message from MQTT Payload
      // If It's on Message Topic
      const currentStreamId = store.getState().liveStream.CURRENT_STREAM_DATA.metaData?.streamId || ''; // When User is Host
      const currentViewerStreamId = store.getState().liveStream.CURRENT_STREAM_DATA.streamUserInfo?.streamId || ''; // When User is Viewer
      if (message.topic?.includes(ISOMETRIK_MQTT_TOPICS.NewMessageEvent) && mqttData.action == 'messageSent' && mqttData.messageType == 1 && mqttData.streamId == currentStreamId) {
        animateBroadcasterStream.next({ type: "LIKED" });
      }
      if (message.topic?.includes(ISOMETRIK_MQTT_TOPICS.NewMessageEvent) && mqttData.action == 'messageSent' && mqttData.messageType == 0 && (uid !== mqttData.deviceId || mqttData.body === "am9pbmVkIHRoZSBzdHJlYW0=")) {
        if (mqttData.streamId === currentStreamId || mqttData.streamId === currentViewerStreamId) {
          store.dispatch(setMessageStreamAction([mqttData]));
        }
      }

      // If Its' Status Topic Response
      if (message.topic?.includes(ISOMETRIK_MQTT_TOPICS.NewMessageEvent)) {
        console.log(currentViewerStreamId === mqttData.streamId, 'is the condition')
        if (mqttData?.action == 'viewerJoined' && mqttData?.streamId == currentStreamId && mqttData?.streamId !== currentViewerStreamId) {
          // if(mqttData.viewersCount) store.dispatch(viewerCountUpdateAction(mqttData.viewersCount));
          addNewViewerStream.next(mqttData);
          // return;
        }
        if (mqttData?.action == 'viewerJoined' && mqttData?.streamId == currentViewerStreamId) {
          if(mqttData.viewersCount) store.dispatch(viewerCountUpdateAction(mqttData.viewersCount));
          store.dispatch(viewerJoinedStream(mqttData));
          // return;
        } 
        if (mqttData.action == 'viewerLeft' && mqttData.streamId == currentStreamId && mqttData?.streamId !== currentViewerStreamId) {
          // if(mqttData.viewersCount) store.dispatch(viewerCountUpdateAction(mqttData.viewersCount));
          removeThisViewerStream.next(mqttData);
          // return;
        }
        if (mqttData.action == 'viewerLeft' && mqttData.streamId == currentViewerStreamId) {
          if(mqttData.viewersCount) store.dispatch(viewerCountUpdateAction(mqttData.viewersCount));
          store.dispatch(viewerLeftStream(mqttData));
          // return;
        }
        if (mqttData.action == 'viewerTimeout' && mqttData.streamId == currentStreamId && mqttData?.streamId !== currentViewerStreamId) {
          // if(mqttData.viewersCount) store.dispatch(viewerCountUpdateAction(mqttData.viewersCount));
          removeThisViewerStream.next(mqttData);
          // return;
        }
        if (mqttData.action == 'viewerTimeout' && mqttData.streamId == currentViewerStreamId) {
          if(mqttData.viewersCount) store.dispatch(viewerCountUpdateAction(mqttData.viewersCount));
          store.dispatch(viewerLeftStream(mqttData));
          // return;
        }
      }
    } catch (err) {
      console.error("message derived error", err);
    }
  };
  function connection() {
    let userId = isAgency() ? getCookie("selectedCreatorId") : getCookie("uid");
    const streamUserId = store.getState().profileData?.isometrikUserId;

    const SubscribeIsometrikTopicRxObject = SubscribeIsometrikTopic.subscribe((topic) => {
      subscribe(topic, client);
    });

    const UnSubscribeIsometrikTopicRxObject = UnSubscribeIsometrikTopic.subscribe((topic) => {
      unsubscribe(topic, client);
    });

    if (streamUserId) {
    try {
      client = new Paho.Client(URL, streamUserId + getDeviceId() + "_stream");
      client.connect({
        userName: Username,
        password: Password,
        useSSL: true,
        mqttVersion: 3,
        keepAliveInterval: 30,
        cleanSession: true,
        reconnect: true,
        onFailure: (e) => {
          const currentStreamId = store.getState().liveStream.CURRENT_STREAM_DATA.metaData?.streamId || ''; // When User is Host
          const currentViewerStreamId = store.getState().liveStream.CURRENT_STREAM_DATA.streamUserInfo?.streamId || ''; // When User is Viewer
          console.log('Failed COnnection --->', e, 'is the error');
          console.error("Failed COnnection ---> It seems like you are logged into another device with this account. Please logout from the other device and try joining the stream again. Failing to do so will cause certain features on this device to not function as expected.")
          store.dispatch(setIsometrikMqttState(false));
          setCookie("mqttConnection", false)
          if (e.errorCode != 6 && (currentStreamId || currentViewerStreamId)) connection();
        },
        onSuccess: (res) => {
          console.log('Isometrik MQTT Connected !!', client);
          setCookie("mqttConnection", true)
          if (isBrowser()) {
            window.mqttAppClient = client;
          }
          store.dispatch(setIsometrikMqttState(true));
          try {
            client.onMessageArrived = onMessageArrived;
          } catch (err) {
            console.error(err, "error");
          }
        }
        });

        client.onConnectionLost = () => {
          store.dispatch(setIsometrikMqttState(false));
          connection()
          setCookie("IsometrikConnected", "false");
        };
      } catch (err) {
        console.error(err, 'is the connection err');
      }
    }
  }

  // const reConnectionSubjectRxObject = reConnectionSubject.subscribe(() => {
  //   console.log('This is fine here =>');
  //   connection();
  // });
  // React.useEffect(() => {
  //   connection();
  //   return () => {
  //     reConnectionSubjectRxObject.unsubscribe();
  //     // client?.disconnect?.();
  //   }
  // }, []);

  React.useEffect(() => {
    if (streamUserId) connection();

  }, [streamUserId])

  return (
    <div>
      {props.render(client)}
    </div>);
};

export default isometrikMQTTHoc;
