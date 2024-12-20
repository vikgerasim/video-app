"use client";
 
import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, addDoc, doc, getDoc, getDocs } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
 
export default function EnhancedUploadForm() {
  const [formData, setFormData] = useState({
    title: "",
    videoUrl: "",
    carMake: "",
    carModel: "",
    yearRange: "",
    workType: "",
    systemCategory: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [categories, setCategories] = useState({
    carMakes: [],
    yearRanges: [],
    workTypes: [],
    systemCategories: [],
  });
 
  const validateVimeoUrl = (url) => {
    // Regular expression to match only player.vimeo.com format
    const vimeoPattern = /^https:\/\/player\.vimeo\.com\/video\/(\d+)\?h=([a-zA-Z0-9]+)$/;
 
    const match = url.match(vimeoPattern);
    if (!match) {
      throw new Error(
        "Invalid Vimeo URL format. URL must be in the format: https://player.vimeo.com/video/[videoId]?h=[hash]"
      );
    }
 
    return {
      videoId: match[1],
      hash: match[2]
    };
  };
 
  // Since we're only accepting the embed URL format now, we don't need to transform it
  const getVimeoEmbedUrl = (url) => {
    try {
      validateVimeoUrl(url);
      return url; // Return the URL as-is since it's already in the correct format
    } catch (error) {
      throw new Error(error.message);
    }
  };
 
  const getVimeoThumbnail = async (url) => {
    try {
      const { videoId } = validateVimeoUrl(url);
      const response = await fetch(
        `https://vimeo.com/api/oembed.json?url=https://vimeo.com/${videoId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch video thumbnail");
      }
      const data = await response.json();
      return data.thumbnail_url || "https://picsum.photos/800/400";
    } catch (error) {
      throw new Error(error.message);
    }
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
 
    try {
      // Validate URL format first
      validateVimeoUrl(formData.videoUrl);
 
      const embedUrl = getVimeoEmbedUrl(formData.videoUrl);
      const thumbnailUrl = await getVimeoThumbnail(formData.videoUrl);
 
      await addDoc(collection(db, "videos"), {
        ...formData,
        embedUrl,
        thumbnailUrl,
        createdAt: new Date().toISOString(),
        views: 0,
        likes: [],
        categories: {
          carMake: formData.carMake,
          carModel: formData.carModel,
          yearRange: formData.yearRange,
          workType: formData.workType,
          systemCategory: formData.systemCategory,
        },
      });
 
      setSuccess("Video added successfully!");
      setFormData({
        title: "",
        videoUrl: "",
        carMake: "",
        carModel: "",
        yearRange: "",
        workType: "",
        systemCategory: "",
      });
    } catch (error) {
      setError(error.message || "Failed to add video");
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => {
    async function fetchCategories() {
      const makes = await getDocs(collection(db, "categories/carMakes/items"));
      const workTypes = await getDocs(
        collection(db, "categories/workTypes/items")
      );
      const systemCats = await getDocs(
        collection(db, "categories/systemCategories/items")
      );
 
      setCategories({
        carMakes: makes.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        workTypes: workTypes.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        systemCategories: systemCats.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
      });
    }
    fetchCategories();
  }, []);
 
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Video</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="videoUrl">Vimeo URL</Label>
            <Input
              id="videoUrl"
              value={formData.videoUrl}
              onChange={(e) =>
                setFormData({ ...formData, videoUrl: e.target.value })
              }
              placeholder="https://player.vimeo.com/video/[videoId]?h=[hash]"
              required
            />
          </div>
 
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>
 
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Car Make</Label>
              <Select
                value={formData.carMake}
                onValueChange={(value) =>
                  setFormData({ ...formData, carMake: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select make" />
                </SelectTrigger>
                <SelectContent>
                  {categories.carMakes.map((make) => (
                    <SelectItem key={make.id} value={make.id}>
                      {make.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
 
            <div className="space-y-2">
              <Label>Car Model</Label>
              <Input
                value={formData.carModel}
                onChange={(e) =>
                  setFormData({ ...formData, carModel: e.target.value })
                }
                placeholder="e.g., Camry, RX350"
              />
            </div>
          </div>
 
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Year Range</Label>
              <Input
                value={formData.yearRange}
                onChange={(e) =>
                  setFormData({ ...formData, yearRange: e.target.value })
                }
                placeholder="e.g., 2007-2011"
              />
            </div>
 
            <div className="space-y-2">
              <Label>Work Type</Label>
              <Select
                value={formData.workType}
                onValueChange={(value) =>
                  setFormData({ ...formData, workType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select work type" />
                </SelectTrigger>
                <SelectContent>
                  {categories.workTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
 
          <div className="space-y-2">
            <Label>System Category</Label>
            <Select
              value={formData.systemCategory}
              onValueChange={(value) =>
                setFormData({ ...formData, systemCategory: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select system category" />
              </SelectTrigger>
              <SelectContent>
                {categories.systemCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
 
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
 
          {success && (
            <Alert className="bg-green-50 text-green-700 border-green-200">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
 
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding Video...
              </>
            ) : (
              "Add Video"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
 