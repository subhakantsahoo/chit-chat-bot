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
import { launchImageLibrary } from "react-native-image-picker";
import UploadedImagePage from "./uploaded-image/uploaded-image";
import SEO from "./seo";
const API_KEY_GIMINI = process.env.NEXT_PUBLIC_API_KEY_GIMINI || "";
const AI_MODEL = process.env.NEXT_PUBLIC_AI_MODEL || "";

export default function Home() {
  const [tweet, setTweet] = useState("");
  const [errorText, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<{ text: string; type: string }[]>(
    []
  );
  const [imageUri, setImageUri] = useState<string | null>(null);

  const messagesEndRef = useRef<ScrollView | null>(null);

  const [isMobile, setIsMobile] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [page, setPage] = useState<number>(0);
  const sidebarAnim = useRef(new Animated.Value(-300)).current;

  const handleAttachFile = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: "photo",
        quality: 0.8,
        includeBase64: false,
      });

      if (result.didCancel || result.errorCode || !result.assets?.[0]?.uri)
        return;

      const asset = result.assets[0];
      const uri = asset.uri as string;
      const name = asset.fileName || `image-${Date.now()}.jpg`;

      // Create FormData object
      const formData = new FormData();

      // Solution 1: Convert the image to a Blob first
      const response = await fetch(uri);
      const blob = await response.blob();

      // Append as proper Blob with filename
      formData.append("file", blob, name);

      const uploadResponse = await fetch("/api/s3-upload", {
        method: "POST",
        body: formData,
        // Headers will be set automatically by FormData
      });

      const data = await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error(data.error || "Upload failed");
      }

      console.log("Upload successful:", data);
      setImageUri(uri); // Update state with the image URI
      return data;
    } catch (err) {
      console.error("Upload error:", err);
      throw err;
    }
  };
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
    // if (ima)
    setError("");
    setLoading(true);
    setMessages((prev) => [...prev, { text: tweet, type: "user" }]);
    setTweet("");

    try {
      const promptParts = [];

      if (imageUri) {
        const base64Data = imageUri.split(",")[1];

        promptParts.push({
          inlineData: {
            mimeType: "image/png", // Adjust for JPEG or other formats
            data: base64Data,
          },
        });
      }

      promptParts.push({ text: tweet });
      const result = await model.generateContent(promptParts);
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
      setImageUri(null); // Reset image URI after sending
    }
  };

  // Prevent rendering until hydrated
  if (!hydrated) {
    return <Text>Loading...</Text>;
  }

  const handleMapImage = (page: number) => {
    console.log("called");
    setPage(page);
    setIsSidebarOpen((prev) => !prev);
  };
  return (
    <>
      <SEO
        title="Open AI 2.0"
        description="A cool AI chatbot built with Next.js and Gemini API"
    
      />

      <View style={styles.dashboard}>
        {/* Sidebar for Web (always visible) */}
        {!isMobile ? (
          <View style={styles.sidebar}>
            <Text style={styles.sidebarTitle}>Dashboard</Text>
            <View>
              <TouchableOpacity
                onPress={() => {
                  handleMapImage(0);
                }}
                style={{}}
              >
                <Text style={styles.sidebarItem}>Home</Text>
              </TouchableOpacity>
              <Text style={styles.sidebarItem}>Sentiment Analysis</Text>
              <Text style={styles.sidebarItem}>Reports</Text>
              <Text style={styles.sidebarItem}>Settings</Text>
              <TouchableOpacity
                onPress={() => {
                  handleMapImage(6);
                }}
                style={{}}
              >
                <Text style={styles.sidebarItem}>Uploaed Image</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            {/* Mobile Sidebar */}
            {isSidebarOpen && (
              <Animated.View
                style={[
                  styles.sidebar,
                  { transform: [{ translateX: sidebarAnim }] },
                ]}
              >
                <Text style={styles.sidebarTitle}>Dashboard</Text>
                <TouchableOpacity
                  onPress={toggleSidebar}
                  style={styles.closeBtn}
                >
                  <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>
                <View>
                  <TouchableOpacity
                    onPress={() => {
                      handleMapImage(0);
                    }}
                    style={{}}
                  >
                    <Text style={styles.sidebarItem}>Home</Text>
                  </TouchableOpacity>
                  <Text style={styles.sidebarItem}>Sentiment Analysis</Text>
                  <Text style={styles.sidebarItem}>Reports</Text>
                  <Text style={styles.sidebarItem}>Settings</Text>
                  <TouchableOpacity
                    onPress={() => {
                      handleMapImage(6);
                    }}
                    style={{}}
                  >
                    <Text style={styles.sidebarItem}>Uploaed Image</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            )}

            {/* Hamburger Menu */}
            {!isSidebarOpen && (
              <TouchableOpacity
                style={styles.hamburger}
                onPress={toggleSidebar}
              >
                <Text style={styles.hamburgerText}>☰</Text>
              </TouchableOpacity>
            )}
          </>
        )}

        <View style={styles.mainContent}>
          {page === 6 ? (
            <UploadedImagePage />
          ) : (
            <>
              <ScrollView
                ref={messagesEndRef}
                contentContainerStyle={{ paddingBottom: 60 }}
              >
                <View style={styles.card}>
                  <Text style={styles.title}>Ai-chat-Bot</Text>
                  <Text style={styles.description}>What can I help with?</Text>
                </View>
                <View style={{ padding: 20 }}>
                  {messages.map((msg, index) => (
                    <View
                      key={index}
                      style={[
                        styles.message,
                        msg.type === "user"
                          ? [
                              styles.userMessage,
                              { maxWidth: isMobile ? "80%" : "60%" },
                            ]
                          : [
                              styles.aiMessage,
                              { maxWidth: isMobile ? "80%" : "60%" },
                            ],
                        msg.type === "tweakPrompt" && styles.tweakPrompt,
                      ]}
                    >
                      <Text style={styles.messageText}>{msg.text}</Text>
                    </View>
                  ))}
                </View>
                {errorText && <Text style={styles.error}>{errorText}</Text>}
              </ScrollView>

              <View
                style={[
                  styles.inputContainer,
                  { marginBottom: isMobile ? 60 : 0 },
                ]}
              >
                <TextInput
                  style={styles.textInput}
                  placeholder="Ask anything..."
                  placeholderTextColor="#aaa"
                  value={tweet}
                  onChangeText={setTweet}
                  onSubmitEditing={handleOpenAPI}
                />
                <TouchableOpacity
                  style={[styles.attachBtn, { marginLeft: isMobile ? 2 : 8 }]}
                  onPress={handleAttachFile}
                >
                  <Text
                    style={[
                      styles.attachIcon,
                      { fontSize: isMobile ? 18 : 22 },
                    ]}
                  >
                    📎 {imageUri && `(${1})`}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.btn,
                    { marginRight: 10, padding: isMobile ? 10 : 12 },
                  ]}
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
            </>
          )}
        </View>
      </View>
    </>
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
    borderRadius: 5,
  },
  btn: {
    backgroundColor: "#0070f3",
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
  attachBtn: {
    padding: 8,
  },
  attachIcon: {
    color: "#fff",
  },
});
