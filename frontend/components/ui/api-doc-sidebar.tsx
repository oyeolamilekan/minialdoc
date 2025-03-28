"use client"

import { ReactElement } from "react"
import Link from "next/link"
import { CodeSquare, GalleryVerticalEnd, MoreHorizontal, Pencil, Plus, Trash } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { EndpointData, Section } from "@/interfaces"
import { truncateWithDots } from "@/lib/utils"

interface ApiDocSidebarProps {
  title: string
  appSlug: string
  endpointSlug: string
  items: Section[]
  handleAddEndpoint: (sectionSlug?: string) => void
  handleDeleteSection: (sectionSlug?: string) => void
  handleEditSection: (sectionSlug: string, sectionText: string) => void
  handleAddSection: () => void
  children: ReactElement
}

export function ApiDocSidebar({
  title,
  appSlug,
  endpointSlug,
  items,
  handleAddEndpoint,
  handleDeleteSection,
  handleEditSection,
  handleAddSection,
  children
}: ApiDocSidebarProps) {

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "17rem",
        } as React.CSSProperties
      }
    >
      <Sidebar>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link href={`/dashboard/features/${appSlug}`} prefetch={true}>
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <GalleryVerticalEnd className="size-4" />
                  </div>
                  <div className="flex flex-col gap-0.5 space-y-1 leading-none">
                    <span className="font-semibold">{title ?? ''}</span>
                    <span className="">v1.0.0</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu className="gap-2">
              {items.map((section: Section) => (
                <SidebarMenuItem
                  key={section.id}
                >
                  <div className="relative flex items-center justify-between">
                    <SidebarMenuButton asChild>
                      <Link href={`#${section.slug}`} className="font-semibold text-2xl uppercase truncate block whitespace-nowrap overflow-hidden" prefetch={true}>
                        {truncateWithDots(section.title)}
                      </Link>
                    </SidebarMenuButton>
                    <div className="flex items-center !m-0 !p-0">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="px-2 py-1"
                          >
                            <Plus className="h-4 w-4" />
                            <span className="sr-only">Add Endpoint</span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-40 p-0">
                          <div className="grid">
                            <Button 
                              variant="ghost" 
                              className="flex items-center justify-start gap-2 rounded-none"
                              onClick={(e) => {
                                e.preventDefault()
                                handleAddEndpoint(section.slug)
                              }}>
                              <CodeSquare /> API Endpoint
                            </Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="px-2 py-1"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Section Setting</span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-40 p-0">
                          <div className="grid">
                            <Button variant="ghost" className="flex items-center justify-start gap-2 rounded-none"
                              onClick={() => handleEditSection(section.slug, section.title)}
                            >
                              <Pencil /> Edit
                            </Button>
                            <Button
                              variant="ghost"
                              className="flex items-center justify-start gap-2 rounded-none text-red-500 hover:text-red-500 hover:bg-red-50"
                              onClick={() => handleDeleteSection(section.slug)}
                            >
                              <Trash /> Delete
                            </Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <SidebarMenuSub className="m-0 border-l-0 p-0">
                    {section.endpoints.map((endpoint: EndpointData) => (
                      <SidebarMenuSubItem key={endpoint.id}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={endpointSlug === endpoint.slug}
                        >
                          <Link
                            className="cursor-pointer flex items-center justify-between gap-2"
                            href={`/api-reference/${appSlug}/${endpoint.slug}`}
                          >
                            <span className="capitalize">{endpoint.title}</span>
                            {endpoint.endpoint_type == "endpoint" && <Badge className="text-xs font-medium text-white bg-black">
                              {endpoint.method}
                            </Badge>}
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className="p-4">
            <Button onClick={handleAddSection} className="w-full justify-center">
              <Plus className="mr-2 h-4 w-4" />
              Add Section
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="mt-3">
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}