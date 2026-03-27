"use client";

import React, { useState } from 'react'
import { Button, Group, Divider, Input, Flex } from 'ui-lab-components'
import { FaList, FaGrip, FaTable, FaPlus } from "react-icons/fa6";
import { LuSearch } from "react-icons/lu";

export const metadata = {
  title: 'Joined Toggle Buttons',
  description: 'Multiple buttons grouped together for view/mode selection with active state indication.'
};

export default function Example() {
  const [viewMode, setViewMode] = useState("list");
  return (
    <Flex className="w-110" gap="xs" align="center">
      <Input
        placeholder="Search items..."
        icon={<LuSearch />}
        className="w-full"
      />
      <Group orientation="horizontal" value={viewMode} onChange={setViewMode}>
        <Group.Button size="icon" value="list"><FaList /></Group.Button>
        <Divider orientation="vertical" />
        <Group.Button size="icon" value="grid"><FaGrip /></Group.Button>
        <Divider orientation="vertical" />
        <Group.Button size="icon" value="table"><FaTable /></Group.Button>
      </Group>
      <Button size="sm" icon={{ left: <FaPlus size={12} /> }} >New</Button>
    </Flex>
  );
}
