export class CreateImageDto {
    private _url: string;
    private _key: string;
    private _mimeType: string;
    private _originalName: string;

    get url(): string {
        return this._url;
    }

    set url(value: string) {
        this._url = value;
    }

    get key(): string {
        return this._key;
    }

    set key(value: string) {
        this._key = value;
    }

    get mimeType(): string {
        return this._mimeType;
    }

    set mimeType(value: string) {
        this._mimeType = value;
    }

    get originalName(): string {
        return this._originalName;
    }

    set originalName(value: string) {
        this._originalName = value;
    }
}