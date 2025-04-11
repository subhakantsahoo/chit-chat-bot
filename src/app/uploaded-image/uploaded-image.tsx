'use client';
import { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Image, useWindowDimensions } from 'react-native';


export default function UploadedImagePage() {
  const [images, setImages] = useState<{ uri: string; label: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const { width } = useWindowDimensions();
  const isMobile = width <= 742;

  const listImagesInFolder = async (): Promise<string[]> => {
    try {
      const res = await fetch("/api/s3-upload"); // Adjust path if hosted separately
      const data = await res.json();
  
      // Only return image URLs
      console.log('data-=-=--=-=-=-=>',data);
      const imageUrls = data.files
        .filter((file: any) => /\.(jpe?g|png|webp|gif)$/i.test(file.fileName)) // filter only image files
        .map((file: any) => file.fileUrl);
      
      return imageUrls;
    } catch (error) {
      console.error("Error fetching images from S3:", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
  
      const urls = await listImagesInFolder(); // ← Use updated function
      const imageData = urls.map((url, index) => ({
        uri: url,
        label: `Image ${index + 1}`,
      }));
  
      setImages(imageData);
      setLoading(false);
    };
  
    fetchImages();
  }, []);
  
  if (loading) return <p>Loading images...</p>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={[styles.title, isMobile && styles.mobileTitle]}>Uploaded Images</Text>

      <View style={styles.cardsContainer}>
      {images.map((item, index) => (
          <View key={index} style={[styles.card, isMobile && styles.mobileCard]}>
            <Image
              source={{ uri: item.uri }}
              style={[styles.image, isMobile && styles.mobileImage]}
              resizeMode="cover"
              alt="Uploaded Image"
            />
            <Text style={[styles.imageLabel, isMobile && styles.mobileLabel]}>
              {item.label}
            </Text>
          </View>
        ))}
      </View>
      {loading && <Text style={styles.loadingText}>Loading...</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    height: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
  },
  mobileTitle: {
    fontSize: 20,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },
  card: {
    width: 300,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center',
    margin: 10,
    paddingBottom: 16,
  },
  mobileCard: {
    width: 260,
  },
  image: {
    width: '100%',
    height: 180,
  },
  mobileImage: {
    height: 140,
  },
  imageLabel: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  mobileLabel: {
    fontSize: 14,
  },
  loadingText: {
    marginTop: 20,
    fontStyle: "italic",
    color: "#555",
  },
});
