import { useState } from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import Button from "../Components/Button";
import FriendsModal from "../Components/Modals/FriendsModal";
import Request from "./FriendsTabs/Request";
import Blocked from "./FriendsTabs/Blocked";
import Friend from "./FriendsTabs/Friend";

// icons    
import { FaUserPlus, FaUserFriends } from "react-icons/fa";
import { MdBlock } from "react-icons/md";
import { AiOutlineUserAdd } from "react-icons/ai";
import { Toaster } from "react-hot-toast";
import Sidebar from "../Components/Sidebar";

const Friends = () => {
    const [showAddFriendModal, setShowAddFriendModal] = useState(false);
    const currentUser = JSON.parse(localStorage.getItem("authState") || "{}");
    const [selectedTab, setSelectedTab] = useState("friends");

    const tabButtons = [
        {
            name: "Arkadaşlar",
            value: "friends",
            variant: "success",
            icon: <FaUserFriends />,
            component: <Friend />,
        },
        {
            name: "İstekler",
            value: "requests",
            variant: "warning",
            icon: <FaUserPlus />,
            component: <Request />,
        },
        {
            name: "Engellenenler",
            value: "blocked",
            variant: "danger",
            icon: <MdBlock />,
            component: <Blocked />,
        },
    ];

    return (
        <div className="flex items-start justify-start min-h-screen bg-gray-50">
            <Sidebar username={currentUser?.data?.username} avatar={currentUser?.data?.avatar} />
            <Toaster />
            {showAddFriendModal && (
                <FriendsModal onClose={() => setShowAddFriendModal(false)} />
            )}

            <div className="container mx-auto px-4 py-8 flex flex-col gap-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 capitalize">
                        Friends - {currentUser?.data?.username || "User"}
                    </h1>
                    <Button
                        variant="primary"
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={() => setShowAddFriendModal(true)}
                    >
                        <AiOutlineUserAdd className="w-5 h-5" />
                        Add Friend
                    </Button>
                </div>

                {/* Tabs */}
                <TabGroup>
                    <TabList className="flex flex-col sm:flex-row justify-center sm:justify-start items-center gap-3 w-full bg-white rounded-xl shadow-md p-2 sm:p-1">
                        {tabButtons.map((button) => (
                            <Tab key={button.value} as="div" className="w-full sm:w-auto">
                                <Button
                                    fullWidth
                                    variant={button.variant as any}
                                    size="sm"
                                    className={`flex items-center gap-2 transition-all duration-200 ${selectedTab === button.value
                                            ? "border-b-2 border-black pb-2 font-semibold text-gray-900"
                                            : "text-gray-600 hover:text-gray-900"
                                        }`}
                                    onClick={() => setSelectedTab(button.value)}
                                >
                                    {button.icon}
                                    {button.name}
                                </Button>
                            </Tab>
                        ))}
                    </TabList>

                    <TabPanels className="mt-6">
                        {tabButtons.map((tab) => (
                            <TabPanel key={tab.value}>
                                <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 transition-all hover:shadow-lg">
                                    {tab.component}
                                </div>
                            </TabPanel>
                        ))}
                    </TabPanels>
                </TabGroup>
            </div>
        </div>
    );
};

export default Friends;
