import { Test, TestingModule } from '@nestjs/testing';
import { GoogleMailService } from './google-mail.service';

describe('GoogleMailService', () => {
  let service: GoogleMailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoogleMailService],
    }).compile();

    service = module.get<GoogleMailService>(GoogleMailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
