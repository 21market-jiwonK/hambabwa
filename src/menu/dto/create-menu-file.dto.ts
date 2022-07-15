import {CreateImageDto} from "../../common/dto/create-image.dto";

export class CreateMenuFileDto extends CreateImageDto {
    constructor(
        key: string,
        url: string,
        mimeType: string,
        originalName: string
    ) {
        super();
        this.key = key;
        this.url = url;
        this.mimeType = mimeType;
        this.originalName = originalName;
    }
}