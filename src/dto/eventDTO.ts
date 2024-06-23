import dayjs from '@/utils/dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
import { BaseDTO } from '@/dto/baseDTO';
import { EventDocument } from '@/interfaces/EventInterface';
import { Types } from 'mongoose';
import TIME_FORMATTER from '@/const/TIME_FORMATTER';
import { generateCustomNanoId } from '@/utils/generateCustomNanoId';
export class EventDTO extends BaseDTO {
  private readonly _storeId!: Types.ObjectId;
  private readonly _address!: string;
  private readonly _isFoodAllowed: boolean;
  private readonly _description: string;
  private readonly _title!: string;
  private readonly _eventStartTime!: string;
  private readonly _eventEndTime!: string;
  private readonly _eventImageUrl!: string[];
  private readonly _registrationStartTime!: string;
  private readonly _registrationEndTime!: string;
  private readonly _maxParticipants!: number;
  private readonly _minParticipants!: number;
  private readonly _currentParticipantsCount!: number;
  private readonly _participationFee!: number;
  private readonly _isPublish!: boolean;
  constructor(dto: Partial<EventDocument>) {
    const dtoWithId = {
      _id: dto._id || new Types.ObjectId(),
      idNumber: dto.idNumber || generateCustomNanoId(),
      createdAt:
        dayjs(dto.createdAt).format(TIME_FORMATTER) ||
        dayjs().format(TIME_FORMATTER),
      updatedAt:
        dayjs(dto.createdAt).format(TIME_FORMATTER) ||
        dayjs().format(TIME_FORMATTER),
    };
    super(dtoWithId);
    this._storeId = dto.storeId ?? new Types.ObjectId();
    this._title = dto.title ?? '';
    this._address = dto.address ?? '';
    this._isFoodAllowed = dto.isFoodAllowed ?? false;
    this._description = dto.description ?? '';
    this._eventStartTime = dto.eventStartTime
      ? dayjs(dto.eventStartTime).format(TIME_FORMATTER)
      : '';
    this._eventEndTime = dto.eventEndTime
      ? dayjs(dto.eventEndTime).format(TIME_FORMATTER)
      : '';
    this._registrationStartTime = dto.registrationStartTime
      ? dayjs(dto.registrationStartTime).format(TIME_FORMATTER)
      : '';
    this._registrationEndTime = dto.registrationEndTime
      ? dayjs(dto.registrationEndTime).format(TIME_FORMATTER)
      : '';
    this._maxParticipants = dto.maxParticipants ?? 0;
    this._minParticipants = dto.minParticipants ?? 0;
    this._currentParticipantsCount = dto.currentParticipantsCount ?? 0;
    this._participationFee = dto.participationFee ?? 0;
    this._eventImageUrl = dto.eventImageUrl ?? [''];
    this._isPublish = dto.isPublish ?? true;
  }
  public get isRegisterable() {
    const now = dayjs();
    return (
      now.isSameOrBefore(this._registrationEndTime) &&
      now.isSameOrAfter(this._registrationStartTime)
    );
  }
  public get availableSeat() {
    return this._maxParticipants - this._currentParticipantsCount;
  }
  public get storeId() {
    return this._storeId;
  }
  public get isPublish() {
    return this._isPublish;
  }
  public get title() {
    return this._title;
  }
  public get address() {
    return this._address;
  }
  public get isFoodAllowed() {
    return this._isFoodAllowed;
  }
  public get description() {
    return this._description;
  }
  public get eventStartTime() {
    return this._eventStartTime;
  }
  public get eventEndTime() {
    return this._eventEndTime;
  }
  public get registrationStartTime() {
    return this._registrationStartTime;
  }
  public get registrationEndTime() {
    return this._registrationEndTime;
  }
  public get maxParticipants() {
    return this._maxParticipants;
  }
  public get minParticipants() {
    return this._minParticipants;
  }
  public get currentParticipantsCount() {
    return this._currentParticipantsCount;
  }
  public get participationFee() {
    return this._participationFee;
  }
  public get eventImageUrl() {
    return this._eventImageUrl;
  }

  public toSummaryDTO(): Partial<EventDocument> {
    return {
      title: this.title,
      address: this.address,
      eventStartTime: this.eventStartTime,
      eventEndTime: this.eventEndTime,
      maxParticipants: this.maxParticipants,
      minParticipants: this.minParticipants,
      currentParticipantsCount: this.currentParticipantsCount,
      participationFee: this.participationFee,
    };
  }
  public toDetailDTO(): Partial<EventDocument> {
    return {
      idNumber: this.idNumber,
      storeId: this._storeId,
      isFoodAllowed: this._isFoodAllowed,
      description: this._description,
      title: this.title,
      address: this.address,
      eventStartTime: this.eventStartTime,
      eventEndTime: this.eventEndTime,
      registrationStartTime: this.registrationStartTime,
      registrationEndTime: this.registrationEndTime,
      maxParticipants: this.maxParticipants,
      minParticipants: this.minParticipants,
      currentParticipantsCount: this.currentParticipantsCount,
      participationFee: this.participationFee,
      eventImageUrl: this.eventImageUrl,
    };
  }
}
