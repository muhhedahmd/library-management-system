
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {  BookOpen, Calendar, Library, ShieldCheck, Users} from "lucide-react";

import Link from "next/link"

export default function AdminContent() {
    return (
      <>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage library resources and members</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-24 flex flex-col gap-1 items-center justify-center">
                <Library className="h-6 w-6 mb-1" />
                <span>Manage Books</span>
              </Button>
              <Button variant="outline" className="h-24 flex flex-col gap-1 items-center justify-center">
                <Users className="h-6 w-6 mb-1" />
                <span>Manage Members</span>
              </Button>
              <Button variant="outline" className="h-24 flex flex-col gap-1 items-center justify-center">
                <Calendar className="h-6 w-6 mb-1" />
                <span>View Loans</span>
              </Button>
              <Button variant="outline" className="h-24 flex flex-col gap-1 items-center justify-center">
                <ShieldCheck className="h-6 w-6 mb-1" />
                <span>Permissions</span>
              </Button>
            </div>
          </CardContent>
        </Card>
  
        <Card>
          <CardHeader>
            <CardTitle>System Overview</CardTitle>
            <CardDescription>Current library system status</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="loans">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="loans">Loans</TabsTrigger>
                <TabsTrigger value="returns">Returns</TabsTrigger>
                <TabsTrigger value="overdue">Overdue</TabsTrigger>
              </TabsList>
              <TabsContent value="loans" className="space-y-4 pt-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">Recent Loans</h3>
                  <Link href="#" className="text-sm text-primary hover:underline">
                    View All
                  </Link>
                </div>
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <BookOpen className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Book Title #{i}</p>
                          <p className="text-xs text-muted-foreground">Loaned to: Member Name</p>
                        </div>
                      </div>
                      <Badge variant="outline">Today</Badge>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="returns" className="pt-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-medium">Recent Returns</h3>
                  <Link href="#" className="text-sm text-primary hover:underline">
                    View All
                  </Link>
                </div>
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <BookOpen className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Book Title #{i}</p>
                          <p className="text-xs text-muted-foreground">Returned by: Member Name</p>
                        </div>
                      </div>
                      <Badge variant="outline">Yesterday</Badge>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="overdue" className="pt-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-medium">Overdue Books</h3>
                  <Link href="#" className="text-sm text-primary hover:underline">
                    View All
                  </Link>
                </div>
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <BookOpen className="h-5 w-5 text-destructive" />
                        <div>
                          <p className="text-sm font-medium">Book Title #{i}</p>
                          <p className="text-xs text-muted-foreground">Loaned to: Member Name</p>
                        </div>
                      </div>
                      <Badge variant="destructive">{i * 3} days overdue</Badge>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </>
    )
  }
  