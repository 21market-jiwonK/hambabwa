import {Injectable} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import { S3 } from "aws-sdk";
import { v4 as uuid } from "uuid";
import * as XLSX from "xlsx";
import {extname} from "path";

@Injectable()
export class CommonService {
    constructor(
       private readonly configService: ConfigService
    ) {}

    async uploadFile(file: Express.Multer.File, path: string) {
        const s3 = new S3();
        return await s3.upload({
            Bucket: this.configService.get('AWS_S3_IMAGE'),
            Body: file.buffer,
            ContentType: file.mimetype,
            Key: `${this.configService.get('AWS_S3_REPOSITORY')}/${path}/${uuid()}${extname(file.originalname)}`
        }).promise();
    }

    async uploadFiles(files: Express.Multer.File[], path: string) {
        const s3 = new S3();
        let result = [];

        for (const key in files) {
            const file = (files[key][0]);
            const uploadResult = await s3.upload({
                Bucket: this.configService.get('AWS_S3_IMAGE'),
                Body: file.buffer,
                Key: `${path}/${uuid()}`
            }).promise();

            result.push(uploadResult);
        }

        return result;
    }

    async createExcel(data: any[], sheetName: string): Promise<any> {
        const wb = XLSX.utils.book_new();
        const newWorksheet = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, newWorksheet, sheetName);

        return XLSX.write(wb, {
            bookType: 'xlsx', type: 'base64'
        });
    }

    uploadExcel(file: Express.Multer.File): any[] {
        const workbook = XLSX.read(file.buffer, {type: 'buffer'});
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        return XLSX.utils.sheet_to_json(sheet, {
            defval: null,
        });
    }
}