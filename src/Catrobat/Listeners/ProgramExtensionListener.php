<?php

namespace App\Catrobat\Listeners;

use App\Catrobat\Events\ProgramBeforePersistEvent;
use App\Catrobat\Services\ExtractedCatrobatFile;
use App\Entity\Extension;
use App\Entity\Program;
use App\Repository\ExtensionRepository;
use Exception;
use Psr\Log\LoggerInterface;

class ProgramExtensionListener
{
  protected ExtensionRepository $extension_repository;
  protected LoggerInterface $logger;

  public function __construct(ExtensionRepository $repo, LoggerInterface $logger)
  {
    $this->extension_repository = $repo;
    $this->logger = $logger;
  }

  public function onEvent(ProgramBeforePersistEvent $event): void
  {
    $this->addExtensions($event->getExtractedFile(), $event->getProgramEntity());
  }

  public function addExtensions(ExtractedCatrobatFile $extracted_file, Program $program): void
  {
    $program->removeAllExtensions();

    $code_xml = strval($extracted_file->getProgramXmlProperties()->asXML());

    // What about arduino, drone, lego, raspberry, chromecast ?
    $this->addPhiroExtensions($program, $code_xml);
    $this->addEmbroideryExtensions($program, $code_xml);
    $this->addMindstormsExtensions($program, $code_xml);
  }

  public function addEmbroideryExtensions(Program $program, string $code_xml): void
  {
    if ($this->isAnEmbroideryProject($code_xml)) {
      $extension = $this->getExtension(Extension::EMBROIDERY);
      if (!is_null($extension)) {
        $program->addExtension($extension);
      }
    }
  }

  public function addMindstormsExtensions(Program $program, string $code_xml): void
  {
    if ($this->isAnEmbroideryProject($code_xml)) {
      $extension = $this->getExtension(Extension::MINDSTORMS);
      if (!is_null($extension)) {
        $program->addExtension($extension);
      }
    }
  }

  public function addPhiroExtensions(Program $program, string $code_xml): void
  {
    if ($this->isAPhiroProject($code_xml)) {
      $extension = $this->getExtension(Extension::PHIRO);
      if (!is_null($extension)) {
        $program->addExtension($extension);
      }
    }
  }

  protected function isAnEmbroideryProject(string $code_xml): bool
  {
    return false !== strpos($code_xml, '<brick type="StitchBrick">');
  }

  protected function isAMindstormsProject(string $code_xml): bool
  {
    return 1 === preg_match('@ToDo: mindstorms regex for bricks@', $code_xml, $matches);
  }

  protected function isAPhiroProject(string $code_xml): bool
  {
    return false !== strpos($code_xml, '<brick type="Phiro');
  }

  /**
   * @throws Exception
   */
  protected function getExtension(string $internal_title): ?Extension
  {
    /** @var Extension|null $extension */
    $extension = $this->extension_repository->findOneBy(['internal_title' => $internal_title]);
    if (null === $extension) {
      $this->logger->alert("Extension `{$internal_title}` is missing!");
    }

    return $extension;
  }
}
