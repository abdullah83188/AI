import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Edit2, Check, X, Tag } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Category, InsertCategory } from '@shared/schema';

interface CategoryManagerProps {
  className?: string;
}

export default function CategoryManager({ className = "" }: CategoryManagerProps) {
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (categoryData: InsertCategory) => {
      return await apiRequest('/api/categories', {
        method: 'POST',
        body: JSON.stringify(categoryData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      setNewCategory({ name: '', description: '' });
      setIsAddingCategory(false);
      toast({
        title: "Success",
        description: "Category created successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create category",
        variant: "destructive",
      });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async (categoryData: Category) => {
      return await apiRequest(`/api/categories/${categoryData.id}`, {
        method: 'PUT',
        body: JSON.stringify(categoryData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      setEditingCategory(null);
      toast({
        title: "Success",
        description: "Category updated successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update category",
        variant: "destructive",
      });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (categoryId: number) => {
      return await apiRequest(`/api/categories/${categoryId}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      toast({
        title: "Success",
        description: "Category deleted successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete category",
        variant: "destructive",
      });
    },
  });

  const handleCreateCategory = () => {
    if (!newCategory.name.trim()) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive",
      });
      return;
    }

    createCategoryMutation.mutate({
      name: newCategory.name.trim(),
      description: newCategory.description.trim() || undefined,
    });
  };

  const handleUpdateCategory = () => {
    if (!editingCategory || !editingCategory.name.trim()) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive",
      });
      return;
    }

    updateCategoryMutation.mutate(editingCategory);
  };

  const handleDeleteCategory = (categoryId: number) => {
    if (window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      deleteCategoryMutation.mutate(categoryId);
    }
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Category Management
          </CardTitle>
          <CardDescription>Loading categories...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tag className="h-5 w-5" />
          Category Management
        </CardTitle>
        <CardDescription>
          Manage blog categories to organize your content effectively
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Add New Category */}
          <div className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Add New Category</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAddingCategory(!isAddingCategory)}
              >
                <Plus className="h-4 w-4 mr-2" />
                {isAddingCategory ? 'Cancel' : 'Add Category'}
              </Button>
            </div>
            
            {isAddingCategory && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="category-name">Category Name</Label>
                  <Input
                    id="category-name"
                    placeholder="Enter category name"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="category-description">Description (Optional)</Label>
                  <Textarea
                    id="category-description"
                    placeholder="Enter category description"
                    value={newCategory.description}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <Button
                  onClick={handleCreateCategory}
                  disabled={createCategoryMutation.isPending || !newCategory.name.trim()}
                  className="w-full"
                >
                  {createCategoryMutation.isPending ? 'Creating...' : 'Create Category'}
                </Button>
              </div>
            )}
          </div>

          {/* Existing Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Existing Categories</h3>
            {categories && categories.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {categories.map((category: Category) => (
                  <Card key={category.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      {editingCategory?.id === category.id ? (
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor={`edit-name-${category.id}`}>Category Name</Label>
                            <Input
                              id={`edit-name-${category.id}`}
                              value={editingCategory.name}
                              onChange={(e) => setEditingCategory(prev => prev ? { ...prev, name: e.target.value } : null)}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`edit-description-${category.id}`}>Description</Label>
                            <Textarea
                              id={`edit-description-${category.id}`}
                              value={editingCategory.description || ''}
                              onChange={(e) => setEditingCategory(prev => prev ? { ...prev, description: e.target.value } : null)}
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={handleUpdateCategory}
                              disabled={updateCategoryMutation.isPending}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingCategory(null)}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary">{category.name}</Badge>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setEditingCategory(category)}
                              >
                                <Edit2 className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteCategory(category.id)}
                                disabled={deleteCategoryMutation.isPending}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          {category.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {category.description}
                            </p>
                          )}
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Created: {new Date(category.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Tag className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No categories found. Create your first category to get started!</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}