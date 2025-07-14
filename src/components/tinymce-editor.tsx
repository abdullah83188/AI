import { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Upload, Image, Link, Code } from 'lucide-react';

interface TinyMCEEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  height?: number;
}

export default function TinyMCEEditor({ 
  value, 
  onChange, 
  placeholder = "Start writing your blog post...",
  height = 500
}: TinyMCEEditorProps) {
  const editorRef = useRef<any>(null);

  const handleEditorChange = (content: string, editor: any) => {
    onChange(content);
    console.log('Content updated:', content.length, 'characters');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Professional Blog Editor
          <Badge variant="secondary" className="ml-2">
            TinyMCE Powered
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap gap-2">
          <Badge variant="outline" className="text-xs">
            <Upload className="h-3 w-3 mr-1" />
            Drag & Drop Files
          </Badge>
          <Badge variant="outline" className="text-xs">
            <Image className="h-3 w-3 mr-1" />
            Image Upload
          </Badge>
          <Badge variant="outline" className="text-xs">
            <Link className="h-3 w-3 mr-1" />
            Link Manager
          </Badge>
          <Badge variant="outline" className="text-xs">
            <Code className="h-3 w-3 mr-1" />
            Code Syntax
          </Badge>
        </div>
        
        <Editor
          apiKey="no-api-key" // Using tinymce from node_modules
          onInit={(evt, editor) => {
            editorRef.current = editor;
            console.log('TinyMCE Editor initialized successfully!');
          }}
          value={value}
          onEditorChange={handleEditorChange}
          init={{
            height: height,
            menubar: true,
            plugins: [
              'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
              'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
              'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount',
              'paste', 'emoticons', 'codesample', 'quickbars'
            ],
            toolbar: 'undo redo | blocks | ' +
              'bold italic forecolor | alignleft aligncenter ' +
              'alignright alignjustify | bullist numlist outdent indent | ' +
              'removeformat | help | link image media | codesample | fullscreen',
            content_style: `
              body { 
                font-family: 'Inter', sans-serif; 
                font-size: 16px; 
                line-height: 1.6; 
                color: #1f2937;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
              }
              h1, h2, h3, h4, h5, h6 { 
                color: #111827; 
                margin-top: 1.5em; 
                margin-bottom: 0.5em;
              }
              p { margin-bottom: 1em; }
              blockquote { 
                border-left: 4px solid #3b82f6; 
                padding-left: 1rem; 
                margin-left: 0; 
                color: #6b7280;
                font-style: italic;
              }
              code { 
                background: #f3f4f6; 
                padding: 2px 4px; 
                border-radius: 3px; 
                font-family: 'JetBrains Mono', monospace;
              }
              pre { 
                background: #1f2937; 
                color: #f9fafb; 
                padding: 1rem; 
                border-radius: 6px; 
                overflow-x: auto;
              }
              img { 
                max-width: 100%; 
                height: auto; 
                border-radius: 6px;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
              }
              a { 
                color: #3b82f6; 
                text-decoration: none; 
              }
              a:hover { 
                text-decoration: underline; 
              }
              .mce-content-body[data-mce-placeholder]:not(.mce-visualblocks)::before {
                color: #9ca3af;
                font-style: italic;
              }
            `,
            placeholder: placeholder,
            branding: false,
            promotion: false,
            resize: 'vertical',
            statusbar: true,
            elementpath: false,
            paste_data_images: true,
            automatic_uploads: true,
            file_picker_types: 'image',
            file_picker_callback: (callback, value, meta) => {
              console.log('File picker triggered for:', meta.filetype);
              // Create file input
              const input = document.createElement('input');
              input.setAttribute('type', 'file');
              input.setAttribute('accept', 'image/*');
              
              input.onchange = function(e: any) {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = function(e) {
                    callback(e.target?.result as string, {
                      alt: file.name,
                      title: file.name
                    });
                  };
                  reader.readAsDataURL(file);
                }
              };
              
              input.click();
            },
            images_upload_handler: (blobInfo, progress) => {
              return new Promise((resolve, reject) => {
                // Convert blob to base64 for now
                const reader = new FileReader();
                reader.onload = () => {
                  resolve(reader.result as string);
                };
                reader.onerror = reject;
                reader.readAsDataURL(blobInfo.blob());
              });
            },
            setup: (editor) => {
              // Add custom commands
              editor.ui.registry.addButton('adsense', {
                text: 'AdSense',
                icon: 'template',
                onAction: () => {
                  editor.insertContent(`
                    <div style="text-align: center; margin: 20px 0; padding: 10px; background: #f0f9ff; border: 1px dashed #3b82f6; border-radius: 6px;">
                      <p style="color: #1e40af; font-size: 14px; margin: 0;">
                        📢 AdSense Ad Placement
                      </p>
                      <p style="color: #6b7280; font-size: 12px; margin: 5px 0 0 0;">
                        This will be replaced with actual Google AdSense ads
                      </p>
                    </div>
                  `);
                }
              });
              
              editor.ui.registry.addButton('affiliate', {
                text: 'Affiliate Link',
                icon: 'link',
                onAction: () => {
                  editor.windowManager.open({
                    title: 'Add Affiliate Link',
                    body: {
                      type: 'panel',
                      items: [
                        {
                          type: 'input',
                          name: 'text',
                          label: 'Link Text',
                          placeholder: 'Check out this product'
                        },
                        {
                          type: 'input',
                          name: 'url',
                          label: 'Product URL',
                          placeholder: 'https://example.com/product'
                        }
                      ]
                    },
                    buttons: [
                      {
                        type: 'cancel',
                        text: 'Cancel'
                      },
                      {
                        type: 'submit',
                        text: 'Add Link',
                        primary: true
                      }
                    ],
                    onSubmit: (api) => {
                      const data = api.getData();
                      const affiliateUrl = `${data.url}?ref=ai-voyager-blog&utm_source=blog&utm_medium=affiliate`;
                      editor.insertContent(`
                        <a href="${affiliateUrl}" target="_blank" rel="noopener noreferrer nofollow" style="color: #3b82f6; text-decoration: none; font-weight: 500;">
                          ${data.text} 🔗
                        </a>
                      `);
                      api.close();
                    }
                  });
                }
              });
            }
          }}
        />
        
        <div className="mt-4 text-sm text-muted-foreground">
          <p>
            <strong>Pro Tips:</strong> Use Ctrl+/ for help, drag & drop images, 
            and use the AdSense button to add monetization placeholders.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}