import React from "react";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";

export default function UserProfilePage() {
  return (
    <motion.div
      className="min-h-screen bg-gray-50 flex justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="w-full max-w-3xl shadow-lg rounded-2xl overflow-hidden bg-white">
        {/* Banner */}
        <div className="relative">
          <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-500"></div>

          {/* Profile Picture */}
          <div className="absolute -bottom-16 left-6">
            <img
              src="https://via.placeholder.com/120"
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover"
            />
          </div>
        </div>

        {/* Profile Info */}
        <Card className="pt-20 pb-6 px-6 bg-white">
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-2xl font-semibold">Jane Doe</h2>
                <p className="text-gray-500 text-sm">
                  Web Developer | Halifax, NS
                </p>
              </div>
              <Button
                type="button"
                className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg transition"
              >
                Edit Profile
              </Button>
            </div>

            <hr className="my-6 border-gray-200" />

            {/* About Section */}
            <div>
              <h3 className="text-lg font-medium mb-2">About</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Passionate about front-end development and creating user-friendly
                web experiences. Loves collaborating with others to build clean,
                engaging designs and seamless interactions.
              </p>
            </div>

            <hr className="my-6 border-gray-200" />

            {/* Activity Feed (Placeholder) */}
            <div>
              <h3 className="text-lg font-medium mb-3">Recent Activity</h3>
              <div className="space-y-4">
                <div className="p-4 border border-gray-100 rounded-lg shadow-sm">
                  <p className="text-gray-800 font-medium">
                    Jane shared a new post
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    “Excited to start a new project this week! 🚀”
                  </p>
                </div>
                <div className="p-4 border border-gray-100 rounded-lg shadow-sm">
                  <p className="text-gray-800 font-medium">
                    Jane updated her profile picture
                  </p>
                  <p className="text-gray-600 text-sm mt-1">2 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
