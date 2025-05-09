import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import React from 'react'

const MjpegStream = () => {
  const streamUrl = 'http://192.168.30.236:8000/stream.mjpg'; // MJPEG 스트림 주소

  const htmlContent = `
    <html>
      <body style="margin:0;padding:0;overflow:hidden;">
        <img src="${streamUrl}" style="width:100%;height:100%;" />
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Live Camera Stream</Text>
      <WebView
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
      />
    </View>
  )
}

export default MjpegStream

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 10,
  },
  webview: {
    width: Dimensions.get('window').width,
    height: 480,
  },
})