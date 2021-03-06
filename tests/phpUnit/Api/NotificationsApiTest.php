<?php

declare(strict_types=1);

namespace Tests\phpUnit\Api;

use App\Api\NotificationsApi;
use App\Api\Services\Base\AbstractApiController;
use App\Api\Services\Notifications\NotificationsApiFacade;
use OpenAPI\Server\Api\NotificationsApiInterface;
use PHPUnit\Framework\MockObject\MockObject;
use Symfony\Component\HttpFoundation\Response;
use Tests\phpUnit\CatrowebPhpUnit\CatrowebTestCase;

/**
 * @internal
 * @coversDefaultClass \App\Api\NotificationsApi
 */
class NotificationsApiTest extends CatrowebTestCase
{
  /**
   * @var NotificationsApi|MockObject
   */
  protected $object;

  /**
   * @var NotificationsApiFacade|MockObject
   */
  protected $facade;

  protected function setUp(): void
  {
    $this->object = $this->getMockBuilder(NotificationsApi::class)
      ->disableOriginalConstructor()
      ->getMockForAbstractClass()
    ;

    $this->facade = $this->createMock(NotificationsApiFacade::class);
    $this->mockProperty(NotificationsApi::class, $this->object, 'facade', $this->facade);
  }

  /**
   * @group integration
   * @small
   */
  public function testTestClassExists(): void
  {
    $this->assertTrue(class_exists(NotificationsApi::class));
    $this->assertInstanceOf(NotificationsApi::class, $this->object);
  }

  /**
   * @group integration
   * @small
   */
  public function testTestClassExtends(): void
  {
    $this->assertInstanceOf(AbstractApiController::class, $this->object);
  }

  /**
   * @group integration
   * @small
   */
  public function testTestClassImplements(): void
  {
    $this->assertInstanceOf(NotificationsApiInterface::class, $this->object);
  }

  /**
   * @group integration
   * @small
   */
  public function testCtor(): void
  {
    $this->object = new NotificationsApi($this->facade);
    $this->assertInstanceOf(NotificationsApi::class, $this->object);
  }

  /**
   * @group unit
   * @small
   * @covers \App\Api\NotificationsApi::notificationIdReadPut
   */
  public function testNotificationIdReadPut(): void
  {
    $response_code = null;
    $response_headers = [];

    $response = $this->object->notificationIdReadPut(1, null, $response_code, $response_headers);

    $this->assertEquals(Response::HTTP_NOT_IMPLEMENTED, $response_code);
    $this->assertNull($response);
  }

  /**
   * @group unit
   * @small
   * @covers \App\Api\NotificationsApi::notificationsCountGet
   */
  public function testNotificationsCountGet(): void
  {
    $response_code = null;
    $response_headers = [];

    $response = $this->object->notificationsCountGet($response_code, $response_headers);

    $this->assertEquals(Response::HTTP_NOT_IMPLEMENTED, $response_code);
    $this->assertNull($response);
  }

  /**
   * @group unit
   * @small
   * @covers \App\Api\NotificationsApi::notificationsGet
   */
  public function testNotificationsGet(): void
  {
    $response_code = null;
    $response_headers = [];

    $response = $this->object->notificationsGet(null, null, null, null, $response_code, $response_headers);

    $this->assertEquals(Response::HTTP_NOT_IMPLEMENTED, $response_code);
    $this->assertNull($response);
  }

  /**
   * @group unit
   * @small
   * @covers \App\Api\NotificationsApi::notificationsReadPut
   */
  public function testNotificationsReadPut(): void
  {
    $response_code = null;
    $response_headers = [];

    $response = $this->object->notificationsReadPut($response_code, $response_headers);

    $this->assertEquals(Response::HTTP_NOT_IMPLEMENTED, $response_code);
    $this->assertNull($response);
  }
}
