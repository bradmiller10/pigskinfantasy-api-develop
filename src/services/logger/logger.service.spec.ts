import { Logger } from './logger.service';

describe('Logger', () => {
  const service = new Logger('test');

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should update context', () => {
    service.setContext('new');
    expect(service.getContext()).toEqual('new');
  });
  it('should clear context', () => {
    service.clearContext();
    expect(service.getContext()).toBeUndefined();
  });
});
