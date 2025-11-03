import {
  HStack,
  VStack,
  Skeleton,
  SkeletonCircle,
  Box,
} from "@chakra-ui/react";

function SkeletonLoading() {
  return (
    <VStack align="stretch" spacing={4} width={"100%"} padding={"2px"}>
      <HStack spacing={4} align="center">
        <SkeletonCircle size="14" />
        <Box flex="1">
          <Skeleton height="16px" mb="2" />
          <Skeleton height="14px" width="80%" mb="2" />
          <Skeleton height="14px" width="60%" />
        </Box>
      </HStack>

      <HStack spacing={4} align="center">
        <SkeletonCircle size="14" />
        <Box flex="1">
          <Skeleton height="16px" mb="2" />
          <Skeleton height="14px" width="80%" mb="2" />
          <Skeleton height="14px" width="60%" />
        </Box>
      </HStack>

      <HStack spacing={4} align="center">
        <SkeletonCircle size="14" />
        <Box flex="1">
          <Skeleton height="16px" mb="2" />
          <Skeleton height="14px" width="80%" mb="2" />
          <Skeleton height="14px" width="60%" />
        </Box>
      </HStack>
      <HStack spacing={4} align="center">
        <SkeletonCircle size="14" />
        <Box flex="1">
          <Skeleton height="16px" mb="2" />
          <Skeleton height="14px" width="80%" mb="2" />
          <Skeleton height="14px" width="60%" />
        </Box>
      </HStack>
    </VStack>
  );
}

export default SkeletonLoading;
