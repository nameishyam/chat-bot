import {
  Text,
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
} from "react-native";
import "./globals.css";

export default function Index() {
  return (
    <SafeAreaView className="flex-1 bg-indigo-50">
      <StatusBar barStyle="dark-content" backgroundColor="#eef2ff" />
      <View className="flex-1 px-6 pt-12 pb-8">
        <View className="items-center mb-10">
          <View className="w-20 h-20 rounded-full bg-indigo-600 items-center justify-center mb-4">
            <Text className="text-white text-4xl font-bold">G</Text>
          </View>
          <Text className="text-3xl font-bold text-indigo-800 mb-1">
            GenieX
          </Text>
          <Text className="text-sm text-gray-500">
            Your intelligent conversation partner
          </Text>
        </View>

        <View className="flex-1 justify-center">
          <View className="bg-white rounded-3xl p-6 shadow-lg mb-8">
            <Text className="text-2xl font-bold text-indigo-900 mb-4">
              Welcome to GenieX!
            </Text>
            <Text className="text-gray-700 mb-3">
              Experience the next generation of conversational AI that
              understands and responds to your needs.
            </Text>
            <View className="flex-row flex-wrap">
              <View className="flex-row items-center mb-2 mr-4">
                <View className="w-8 h-8 rounded-full bg-green-100 items-center justify-center mr-2">
                  <Text className="text-green-600 font-bold">✓</Text>
                </View>
                <Text className="text-gray-700">24/7 Assistance</Text>
              </View>
              <View className="flex-row items-center mb-2 mr-4">
                <View className="w-8 h-8 rounded-full bg-blue-100 items-center justify-center mr-2">
                  <Text className="text-blue-600 font-bold">✓</Text>
                </View>
                <Text className="text-gray-700">Smart Replies</Text>
              </View>
              <View className="flex-row items-center mb-2">
                <View className="w-8 h-8 rounded-full bg-purple-100 items-center justify-center mr-2">
                  <Text className="text-purple-600 font-bold">✓</Text>
                </View>
                <Text className="text-gray-700">Voice Support</Text>
              </View>
            </View>
          </View>
        </View>

        <View className="mt-auto">
          <TouchableOpacity className="bg-indigo-600 py-4 rounded-xl mb-4 shadow-md">
            <Text className="text-white text-center font-bold text-lg">
              Sign Up
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-white border border-indigo-600 py-4 rounded-xl shadow-sm">
            <Text className="text-indigo-600 text-center font-bold text-lg">
              Log In
            </Text>
          </TouchableOpacity>

          <Text className="text-xs text-center text-gray-500 mt-6">
            By continuing, you agree to our Terms of Service & Privacy Policy
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
