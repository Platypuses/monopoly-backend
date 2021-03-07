export default interface ErrorResponseDto {
  message: string;
  status: number;
  timestamp: Date;
  path: string;
}
