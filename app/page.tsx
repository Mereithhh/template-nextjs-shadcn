"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { TGIInstance } from "@/types/tgi";


export default function TGIList() {
  const [instances, setInstances] = useState<TGIInstance[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingInstance, setEditingInstance] = useState<TGIInstance | null>(null);
  const [formData, setFormData] = useState({
    url: "",
    modelId: "",
    notes: "",
  });

  useEffect(() => {
    fetchInstances();
  }, []);

  const fetchInstances = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/tgi');
      const data = await response.json();
      setInstances(data);
    } catch (error) {
      console.error('获取实例失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingInstance) {
        await fetch(`/api/tgi/${editingInstance.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      } else {
        await fetch('/api/tgi', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      }
      fetchInstances();
      setIsOpen(false);
      setEditingInstance(null);
      setFormData({ url: "", modelId: "", notes: "" });
    } catch (error) {
      console.error('保存实例失败:', error);
    }
  };

  const handleEdit = (instance: TGIInstance) => {
    setEditingInstance(instance);
    setFormData({
      url: instance.url,
      modelId: instance.modelId,
      notes: instance.notes,
    });
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/tgi/${id}`, {
        method: 'DELETE',
      });
      fetchInstances();
    } catch (error) {
      console.error('删除实例失败:', error);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">TGI 实例管理</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={fetchInstances}
            disabled={isLoading}
          >
            {isLoading ? "刷新中..." : "刷新"}
          </Button>

          <Dialog open={isHelpOpen} onOpenChange={setIsHelpOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">使用帮助</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>使用说明</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p>在 OpenAI API 配置中，将 base URL 设置为：</p>
                <code className="block bg-muted p-2 rounded">
                  https://tgi-transfer.glm.ai/api/v1
                </code>
                <p>如有任何问题，请联系王璐。</p>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <PlusCircle className="w-4 h-4" />
                添加实例
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {editingInstance ? "编辑实例" : "添加新实例"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="url">URL 地址(不带pathname) eg: http://172.24.0.158:8080</Label>
                  <Input
                    id="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="请输入 URL 地址"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="modelId">模型 ID (open-webui 上展示的模型 ID)</Label>
                  <Input
                    id="modelId"
                    value={formData.modelId}
                    onChange={(e) => setFormData({ ...formData, modelId: e.target.value })}
                    placeholder="请输入模型 ID"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">备注</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="请输入备注信息"
                  />
                </div>
                <Button type="submit" className="w-full">
                  {editingInstance ? "保存修改" : "添加"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>URL 地址</TableHead>
              <TableHead>模型 ID</TableHead>
              <TableHead>备注</TableHead>
              <TableHead className="w-[100px]">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {instances.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  暂无数据
                </TableCell>
              </TableRow>
            ) : (
              instances.map((instance) => (
                <TableRow key={instance.id}>
                  <TableCell className="font-mono">{instance.url}</TableCell>
                  <TableCell>{instance.modelId}</TableCell>
                  <TableCell>{instance.notes}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(instance)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(instance.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
