import { z } from 'zod';

/**
 * 管理后台验证器统一导出
 */

// 问题相关验证器
export * from './problems';

// 解决方案相关验证器
export * from './solutions';

// 评价相关验证器
export * from './reviews';

// 通用管理后台验证器
export const adminSchemas = {
  // 文件上传验证 Schema
  fileUpload: z.object({
    file: z.instanceof(File, { message: '请选择文件' }),
    type: z.enum(['problems', 'solutions']),
  }),

  // 导出选项验证 Schema
  exportOptions: z.object({
    type: z.enum(['problems', 'solutions']),
    format: z.enum(['xlsx', 'csv']).default('xlsx'),
    includeMetadata: z.boolean().default(false),
  }),

  // 数据导入验证
  import: z.object({
    type: z.enum(['problems', 'solutions'], { message: '导入类型必须是problems或solutions' }),
    file: z.instanceof(File, { message: '请选择要导入的文件' }),
  }),

  // 数据导出验证
  export: z.object({
    type: z.enum(['problems', 'solutions', 'reviews'], { message: '导出类型必须是problems、solutions或reviews' }),
    format: z.enum(['excel', 'csv'], { message: '导出格式必须是excel或csv' }).default('excel'),
    filters: z.record(z.string(), z.any()).optional(),
  }),
};

// 类型导出
export type FileUploadData = z.infer<typeof adminSchemas.fileUpload>;
export type ExportOptionsData = z.infer<typeof adminSchemas.exportOptions>;
export type ImportData = z.infer<typeof adminSchemas.import>;
export type ExportData = z.infer<typeof adminSchemas.export>;
