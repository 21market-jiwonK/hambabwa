import {Injectable} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import { S3 } from "aws-sdk";
import { v4 as uuid } from "uuid";

@Injectable()
export class CommonService {
    constructor(
       private readonly configService: ConfigService
    ) {}

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
}