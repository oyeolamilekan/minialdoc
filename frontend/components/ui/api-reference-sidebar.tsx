import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger
} from "@/components/ui/sidebar"
import { GalleryVerticalEnd } from "lucide-react"
import { ReactElement } from "react"
import Link from "next/link"
import { Badge } from "./badge"
import { EndpointData } from "@/interfaces"
import { truncateWithDots } from "@/lib/utils"

export interface Section {
  id: number
  title: string
  slug: string
  endpoints: EndpointData[]
}

export function ApiReferenceSidebar({ title, endpointSlug, items, children }: { title: string, endpointSlug: string, items: [], children: ReactElement }) {
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
                <a href="#">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <GalleryVerticalEnd className="size-4" />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-semibold">{title}</span>
                    <span className="">v1.0.0</span>
                  </div>
                </a>
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
                        {truncateWithDots(section.title, 25)}
                      </Link>
                    </SidebarMenuButton>
                  </div>
                  <SidebarMenuSub className="ml-0 border-l-0 p-0">
                    {section.endpoints.map((endpoint: EndpointData) => (
                      <SidebarMenuSubItem key={endpoint.id}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={endpointSlug?.toString().toLowerCase() === endpoint.slug.toLowerCase()}
                        >
                          <Link
                            className="cursor-pointer flex items-center justify-between gap-2"
                            href={`/reference/${endpoint.slug}`}
                            prefetch={true}
                          >
                            <span className="capitalize">{endpoint.title}</span>
                            <div className="flex-none">
                              {endpoint.endpoint_type == "endpoint" && <Badge className="text-xs font-medium text-white bg-black">
                                {endpoint.method}
                              </Badge>}
                            </div>
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
      </Sidebar>
      <SidebarInset className="mt-3">
        <div className="sm:hidden">
          <SidebarTrigger className="ml-5 text-3xl" />
        </div>
        {children}
      </SidebarInset>
    </SidebarProvider>

  )
}

