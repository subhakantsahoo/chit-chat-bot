"use client"; // Ensure it's a Client Component

import { useState, useEffect, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Animated,
} from "react-native";

const API_KEY_GIMINI = process.env.NEXT_PUBLIC_API_KEY_GIMINI || "";
const AI_MODEL = process.env.NEXT_PUBLIC_AI_MODEL || "";

export default function Home() {
  const [tweet, setTweet] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<{ text: string; type: string }[]>([]);
  const messagesEndRef = useRef<ScrollView | null>(null);

  const [isMobile, setIsMobile] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const sidebarAnim = useRef(new Animated.Value(-300)).current;

  // Sidebar toggle
  const toggleSidebar = () => {
    if (isMobile) {
      Animated.timing(sidebarAnim, {
        toValue: isSidebarOpen ? -300 : 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
      setIsSidebarOpen((prev) => !prev);
    }
  };

  const tweakMessages = [
    "Let me know if you need more tweaks! 🚀",
    "Happy to make more changes! 🎉",
    "Got more ideas? Let's tweak it! 💡",
    "Need further improvements? 🔥",
    "Let's fine-tune it even more! ⚡",
    "Any more adjustments needed? 🎯",
    "Always ready for more tweaks! 🌟",
    "Got more feedback? I'm on it! 💎",
  ];

  const getRandomTweakMessage = () => {
    const randomIndex = Math.floor(Math.random() * tweakMessages.length);
    return tweakMessages[randomIndex];
  };

  // Handle hydration and window size detection
  useEffect(() => {
    setHydrated(true);
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const genAI = new GoogleGenerativeAI(API_KEY_GIMINI);
  const model = genAI.getGenerativeModel({ model: AI_MODEL });

  const handleOpenAPI = async () => {
    if (!tweet.trim()) return;

    setError("");
    setLoading(true);

    setMessages((prev) => [...prev, { text: tweet, type: "user" }]);
    setTweet("");

    try {
      const result = await model.generateContent(tweet);
      const response = await result.response;
      const text = response.text();

      setMessages((prev) => [
        ...prev,
        { text, type: "ai" },
        { text: getRandomTweakMessage(), type: "tweakPrompt" },
      ]);
    } catch (err) {
      console.error("API Error:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Prevent rendering until hydrated
  if (!hydrated) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.dashboard}>
      {/* Sidebar for Web (always visible) */}
      {!isMobile ? (
        <View style={styles.sidebar}>
          <Text style={styles.sidebarTitle}>Dashboard</Text>
          <View>
            <Text style={styles.sidebarItem}>Home</Text>
            <Text style={styles.sidebarItem}>Sentiment Analysis</Text>
            <Text style={styles.sidebarItem}>Reports</Text>
            <Text style={styles.sidebarItem}>Settings</Text>
          </View>
        </View>
      ) : (
        <>
          {/* Mobile Sidebar */}
          {isSidebarOpen &&    <Animated.View
            style={[
              styles.sidebar,
              { transform: [{ translateX: sidebarAnim }] },
            ]}
          >
            <Text style={styles.sidebarTitle}>Dashboard</Text>
            <TouchableOpacity onPress={toggleSidebar} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
            <View>
              <Text style={styles.sidebarItem}>Home</Text>
              <Text style={styles.sidebarItem}>Sentiment Analysis</Text>
              <Text style={styles.sidebarItem}>Reports</Text>
              <Text style={styles.sidebarItem}>Settings</Text>
            </View>
          </Animated.View>}
       

          {/* Hamburger Menu */}
          {!isSidebarOpen &&  <TouchableOpacity style={styles.hamburger} onPress={toggleSidebar}>
            <Text style={styles.hamburgerText}>☰</Text>
          </TouchableOpacity> }
         
        </>
      )}

      <View style={styles.mainContent}>
        <ScrollView
          ref={messagesEndRef}
          contentContainerStyle={{ paddingBottom: 60 }}
        >
          <View style={styles.card}>
            <Text style={styles.title}>Ai-chat-Bot</Text>
            <Text style={styles.description}>What can I help with?</Text>
          </View>
          <View style={{ padding:20}}>
          {messages.map((msg, index) => (
            <View
              key={index}
              style={[
                styles.message,
                msg.type === "user"
                  ? [styles.userMessage, { maxWidth: isMobile ? "80%" : "60%" }]
                  : [styles.aiMessage, { maxWidth: isMobile ? "80%" : "60%" }],
                msg.type === "tweakPrompt" && styles.tweakPrompt,
              ]}
            >
              <Text style={styles.messageText}>{msg.text}</Text>
            </View>
          ))}
          </View>
          {error && <Text style={styles.error}>{error}</Text>}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Ask anything..."
            placeholderTextColor="#aaa"
            value={tweet}
            onChangeText={setTweet}
            onSubmitEditing={handleOpenAPI}
          />
          <TouchableOpacity
            style={styles.btn}
            onPress={handleOpenAPI}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>Send</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dashboard: {
    flex: 1,
    flexDirection: "row",
  },
  sidebar: {
    width: 250,
    backgroundColor: "#374151",
    padding: 20,
    zIndex: 10,
  },
  sidebarTitle: {
    fontSize: 22,
    color: "#fff",
    marginBottom: 20,
  },
  sidebarItem: {
    fontSize: 18,
    color: "#ccc",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#555",
  },
  mainContent: {
    flex: 1,
    backgroundColor: "#1F2937",
  },
  card: {
    backgroundColor: "#2d3748",
    borderRadius: 12,
    padding: 20,
    margin: 10,
  },
  textInput: {
    flex: 1,
    padding: 12,
    backgroundColor: "#333",
    color: "#fff",
    borderRadius:5
  },
  btn: {
    backgroundColor: "#0070f3",
    padding: 12,
    borderRadius: 8,
    marginLeft: 10,
  },
  btnText: {
    color: "#fff",
  },
  hamburger: {
    position: "absolute",
    top: 13,
    right: 15,
    zIndex: 20,
  },
  hamburgerText: {
    fontSize: 30,
    color: "#fff",
  },
  closeBtn: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  closeText: {
    fontSize: 20,
    color: "#fff",
  },
  title: {
    fontSize: 32,
    color: "#46c8cc",
    textAlign: "center",
  },
  description: {
    fontSize: 22,
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  message: {
    padding: 12,
    borderRadius: 12,
    marginVertical: 5,
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#414241",
  },
  aiMessage: {
    alignSelf: "flex-start",
    backgroundColor: "black",
  },
  tweakPrompt: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#46c8cc",
  },
  messageText: {
    color: "#fff",
    fontSize: 16,
  },
  error: {
    color: "red",
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#555",
    backgroundColor: "#1F2937",
    alignItems: "center",
  },
});
