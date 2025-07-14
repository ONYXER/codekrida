'use client';

import * as Tabs from '@radix-ui/react-tabs';
import { useState } from 'react';
import shivam from  '../assets/shivam.png'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import {
    Card,
    Avatar,
    Text,
    Flex,
    Box,
} from '@radix-ui/themes';

const users = [
    {
        name: 'Shivam',
        role: 'Project Manager',
        avatar: shivam,
        bio: 'Java Full Stack Web Developer',
    },
    {
        name: 'Bob Smith',
        role: 'Backend Developer',
        avatar: 'https://randomuser.me/api/portraits/men/46.jpg',
        bio: 'Loves Node.js and Spring Boot',
    },
    {
        name: 'Carol Lee',
        role: 'UI/UX Designer',
        avatar: 'https://randomuser.me/api/portraits/women/47.jpg',
        bio: 'Designs clean, intuitive UIs',
    },
];

export default function ThemedUserCarousel() {
    const [activeTab, setActiveTab] = useState('0');

    const prev = () => {
        const prevIndex = (parseInt(activeTab) - 1 + users.length) % users.length;
        setActiveTab(prevIndex.toString());
    };

    const next = () => {
        const nextIndex = (parseInt(activeTab) + 1) % users.length;
        setActiveTab(nextIndex.toString());
    };

    return (
        <Box className="w-full mx-auto  py-4 bg-[var(--accent-9)]">
            <h2 className="text-4xl text-white font-bold text-center my-10 " >About</h2>
            <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="">
                <div className="relative" >
                    <Tabs.List className="hidden" />

                    {users.map((user, index) => (
                        <Tabs.Content key={index} value={index.toString()} className="flex  justify-center">
                            <Card size="3" className="text-center p-0! w-[400px] relative">
                                <Flex direction="column" align="center" gap="3" className="bg-[var(--accent-9)] p-10 text-white">
                                    <Avatar
                                        src={user.avatar}
                                        fallback={user.name[0]}
                                        size="9"
                                        radius="full"
                                    />
                                    <Text as="div" size="5" weight="bold">
                                        {user.name}
                                    </Text>
                                    <Text as="div" size="3" >
                                        {user.role}
                                    </Text>
                                    <Text as="p" size="2" >
                                        {user.bio}
                                    </Text>
                                </Flex>


                                {/* Navigation Arrows */}
                                <button
                                    onClick={prev}
                                    className="absolute top-1/2 left-0 -translate-y-1/2 bg-gray-800/70 text-white p-2 rounded-full"
                                >
                                    <FaChevronLeft />
                                </button>
                                <button
                                    onClick={next}
                                    className="absolute top-1/2 right-0 -translate-y-1/2 bg-gray-800/70 text-white p-2 rounded-full"
                                >
                                    <FaChevronRight />
                                </button>
                            </Card>
                        </Tabs.Content>
                    ))}

                </div>

                {/* Dots */}
                <Flex justify="center" mt="3" gap="2">
                    {users.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveTab(index.toString())}
                            className={`w-3 h-3 rounded-full ${
                                activeTab === index.toString()
                                    ? 'bg-blue-500'
                                    : 'bg-gray-300'
                            }`}
                        />
                    ))}
                </Flex>
            </Tabs.Root>
        </Box>
    );
}